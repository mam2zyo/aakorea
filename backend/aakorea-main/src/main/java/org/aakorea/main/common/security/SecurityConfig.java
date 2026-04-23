package org.aakorea.main.common.security;

import java.util.List;
import org.aakorea.main.auth.application.OfficePermissionService;
import org.aakorea.main.auth.infrastructure.AdminUserPermissionGrantRepository;
import org.aakorea.main.auth.infrastructure.AdminUserRepository;
import org.aakorea.main.auth.support.OfficeAdminPrincipal;
import org.aakorea.main.auth.support.OfficeAdminSessionRefreshFilter;
import org.aakorea.main.common.config.AdminAuthProperties;
import org.aakorea.main.common.config.AppCorsProperties;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.SecurityContextHolderFilter;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableMethodSecurity
// @ConfigurationProperties 클래스를 스프링 빈으로 등록해 application.yml 값을 주입받는다.
@EnableConfigurationProperties({AdminAuthProperties.class, AppCorsProperties.class})
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            CorsConfigurationSource corsConfigurationSource,
            RestAuthenticationEntryPoint authenticationEntryPoint,
            RestAccessDeniedHandler accessDeniedHandler,
            ObjectProvider<OfficeAdminSessionRefreshFilter> officeAdminSessionRefreshFilterProvider
    ) throws Exception {
        // 이 프로젝트는 서버 렌더링 화면이 아니라 JSON API 중심이므로,
        // 기본 로그인 폼/HTTP Basic 대신 세션 기반 API 인증만 남겨 둔다.
        http.cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .requestCache(AbstractHttpConfigurer::disable)
                // SecurityContext를 자동 저장하지 않고, 로그인 성공 시점에만 명시적으로 저장한다.
                // 실제 저장은 AuthService.login()에서 securityContextRepository.saveContext(...)로 수행한다.
                .securityContext(securityContext -> securityContext.requireExplicitSave(true))
                // 세션은 필요할 때만 만든다. 공개 API 호출만으로는 세션을 만들지 않는다.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests(authorize -> authorize
                        // 운영 API는 로그인된 관리자만 접근 가능하다.
                        .requestMatchers("/api/admin/**").authenticated()
                        // 로그인/세션 확인 및 공개 조회 API는 누구나 접근 가능하다.
                        .requestMatchers("/api/auth/**", "/api/public/**").permitAll()
                        // Swagger UI 및 API Docs 엔드포인트 허용
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-resources/**", "/webjars/**").permitAll()
                        // 그 밖의 정적 리소스나 추후 공개 엔드포인트는 기본 허용으로 둔다.

                        .anyRequest().permitAll())
                // 인증 실패/권한 부족 시 HTML 에러 페이지 대신 JSON 응답을 내보낸다.
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler))
                .anonymous(Customizer.withDefaults());

        officeAdminSessionRefreshFilterProvider.ifAvailable(filter ->
                http.addFilterAfter(filter, SecurityContextHolderFilter.class));

        return http.build();
    }

    // 프론트와 백엔드가 분리된 개발/배포 환경에서 브라우저 접근을 허용할 origin 목록이다.
    // 목록 자체는 AppCorsProperties가 들고 있고, 프로필별 yml에서 덮어쓸 수 있다.
    @Bean
    public CorsConfigurationSource corsConfigurationSource(AppCorsProperties properties) {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(properties.getAllowedOrigins());
        // 브라우저 preflight 요청까지 고려해 필요한 메서드를 명시한다.
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        // 관리자 로그인은 세션 쿠키를 사용하므로 credential 허용이 필요하다.
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public UserDetailsService userDetailsService(
            AdminUserRepository adminUserRepository,
            AdminUserPermissionGrantRepository adminUserPermissionGrantRepository,
            OfficePermissionService officePermissionService
    ) {
        return username -> {
            org.aakorea.main.auth.domain.AdminUser adminUser = adminUserRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("admin user not found"));

            return OfficeAdminPrincipal.from(
                    adminUser,
                    officePermissionService.resolvePermissions(
                            adminUser,
                            adminUserPermissionGrantRepository.findAllByAdminUser_IdAndRevokedAtIsNull(adminUser.getId())));
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Spring Security 권장 delegating encoder.
        // 저장된 비밀번호 앞의 {id} prefix로 어떤 해시 방식을 썼는지 구분할 수 있다.
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    public SecurityContextRepository securityContextRepository() {
        // SecurityContext를 HttpSession에 저장해 다음 요청에서도 로그인 상태를 유지한다.
        return new HttpSessionSecurityContextRepository();
    }
}
