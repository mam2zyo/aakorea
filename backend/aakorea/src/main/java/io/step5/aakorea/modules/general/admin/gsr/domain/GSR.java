package io.step5.aakorea.modules.general.admin.gsr.domain;

import io.step5.aakorea.modules.general.admin.group.domain.Group;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class GSR {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nickname;

    private String phone;

    private String mailingAddress;

    @Column(unique = true)
    private String email;

    private String password;

    // GSR ??筌뤿굞??????域밸챶竊???????????덈뮉 ?닌듼??겹늺 ?袁⑥삋?? 揶쏆늿???곕떽? 揶쎛?館鍮??덈뼄.
    @OneToMany(mappedBy = "gsr")
    private List<Group> groups = new ArrayList<>();
}
