import logo from '../../assets/logo.png'
import instagram from '../../assets/instagram.svg'
import facebook from '../../assets/facebook.svg'
import twitter from '../../assets/twitter.svg'
import { Container, Disclaimer, Logo, SocialLinks } from './styles'

const Footer = () => (
  <Container>
    <div className="container">
      <Logo src={logo} alt="efood" />
      <SocialLinks>
        <a
          href="https://www.instagram.com/"
          aria-label="Instagram"
          target="_blank"
          rel="noreferrer"
        >
          <img src={instagram} alt="" />
        </a>
        <a
          href="https://www.facebook.com/"
          aria-label="Facebook"
          target="_blank"
          rel="noreferrer"
        >
          <img src={facebook} alt="" />
        </a>
        <a
          href="https://x.com/"
          aria-label="Twitter"
          target="_blank"
          rel="noreferrer"
        >
          <img src={twitter} alt="" />
        </a>
      </SocialLinks>
      <Disclaimer>
        A efood e uma plataforma para divulgacao de estabelecimentos, a
        responsabilidade pela entrega, qualidade dos produtos e toda do
        estabelecimento contratado.
      </Disclaimer>
    </div>
  </Container>
)

export default Footer
