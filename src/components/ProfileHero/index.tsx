import { HeroContainer, HeroCuisine, HeroTitle } from "./styles";

type Props = {
    cuisine?: string;
    title?: string;
    backgroundImage?: string;
};

const ProfileHero = ({
    cuisine = "Italiana",
    title = "La Dolce Vita Trattoria",
    backgroundImage,
}: Props) => (
    <HeroContainer
        style={
            backgroundImage
                ? { backgroundImage: `url(${backgroundImage})` }
                : {}
        }
    >
        <div className="container">
            <HeroCuisine>{cuisine}</HeroCuisine>
            <HeroTitle>{title}</HeroTitle>
        </div>
    </HeroContainer>
);

export default ProfileHero;
