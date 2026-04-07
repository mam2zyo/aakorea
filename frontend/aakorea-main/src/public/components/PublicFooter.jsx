const ABOUT_GSO_URL = 'http://aakorea.org/aboutgso.html'
const SITE_POLICY_URL = 'http://aakorea.org/aboutgso.html#policy1'

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="public-footer__inner">
        <div className="public-footer__primary">
          <strong className="public-footer__brand">에이에이한국연합</strong>
          <p>사업자등록번호: 107-82-69892</p>
          <hr className="public-footer__divider" />
          <p>주소 : 서울특별시 영등포구 영신로20길 6, 정우빌딩 5층</p>
          <hr className="public-footer__divider" />
          <p>
            전화 :
            {' '}
            <a href="tel:02-774-3797">02-774-3797</a>
            ,
            {' '}
            <a href="tel:02-833-0311">02-833-0311</a>
          </p>
          <p>
            팩스 : 02-833-0422
          </p>
          <p>
            이메일 :
            {' '}
            <a href="mailto:aakoreagso@gmail.com">aakoreagso@gmail.com</a>
          </p>
        </div>

        <div className="public-footer__secondary">
          <a
            className="public-footer__link"
            href={ABOUT_GSO_URL}
            rel="noreferrer"
            target="_blank"
          >
            About G.S.O.
          </a>
          <a
            className="public-footer__link"
            href={SITE_POLICY_URL}
            rel="noreferrer"
            target="_blank"
          >
            사이트 운영정책
          </a>
        </div>
      </div>
    </footer>
  )
}
