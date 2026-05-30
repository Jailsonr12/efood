import { useEffect, useState } from "react";
import ProductsList from "../../components/ProductsList";
import Games from "../../models/Games";
import { Restaurant } from "../../models/Restaurant";

const Home = () => {
    const [restaurantes, setRestaurantes] = useState<Games[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurantes = async () => {
            try {
                const response = await fetch(
                    "https://api-ebac.vercel.app/api/efood/restaurantes",
                );
                const data: Restaurant[] = await response.json();

                const games: Games[] = data.map((restaurante) => ({
                    id: restaurante.id,
                    category: "Saiba mais",
                    description: restaurante.descricao,
                    image: restaurante.capa,
                    title: restaurante.titulo,
                    system: restaurante.avaliacao.toString(),
                    infos: [restaurante.tipo],
                }));

                setRestaurantes(games);
            } catch (error) {
                console.error("Erro ao buscar restaurantes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantes();
    }, []);

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <>
            {/* <Banner /> */}
            <ProductsList
                title="Promoções"
                background="gray"
                games={restaurantes}
            />
        </>
    );
};

export default Home;
