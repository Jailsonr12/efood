import Tag from "../Tag";
import {
    ButtonLink,
    Card,
    Content,
    Descricao,
    Infos,
    Nota,
    TopLine,
    Titulo,
} from "./styles";

import estrela from "../../assets/estrela.png";

type Props = {
    id?: number;
    title: string;
    category: string;
    system: string;
    description: string;
    infos: string[];
    image: string;
};

const Product = ({
    id,
    title,
    category,
    system,
    description,
    infos,
    image,
}: Props) => (
    <Card>
        <img src={image} alt={title} />
        <Infos>
            {infos.map((info) => (
                <Tag key={info}>{info}</Tag>
            ))}
        </Infos>
        <Content>
            <TopLine>
                <Titulo>{title}</Titulo>
                <Nota>
                    <span>{system}</span>
                    <img src={estrela} alt="estrela" />
                </Nota>
            </TopLine>

            <Descricao>{description}</Descricao>
            <ButtonLink
                to={id ? `/restaurante/${id}` : "/perfil"}
                title={`Saiba mais sobre ${title}`}
            >
                {category}
            </ButtonLink>
        </Content>
    </Card>
);

export default Product;
