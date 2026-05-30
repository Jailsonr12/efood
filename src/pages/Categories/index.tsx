import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileHero from "../../components/ProfileHero";
import RestaurantMenu, { Dish } from "../../components/RestaurantMenu";
import { Restaurant } from "../../models/Restaurant";

const Categories = () => {
    const { id } = useParams<{ id?: string }>();
    const [restaurante, setRestaurante] = useState<Restaurant | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurante = async () => {
            try {
                if (id) {
                    const response = await fetch(
                        "https://api-ebac.vercel.app/api/efood/restaurantes",
                    );
                    const data: Restaurant[] = await response.json();
                    const found = data.find((r) => r.id.toString() === id);
                    setRestaurante(found || null);
                }
            } catch (error) {
                console.error("Erro ao buscar restaurante:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurante();
    }, [id]);

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!restaurante) {
        return <div>Restaurante não encontrado</div>;
    }

    const dishes: Dish[] = restaurante.cardapio.map((item) => ({
        id: item.id,
        title: item.nome,
        description: item.descricao,
        image: item.foto,
        price: item.preco,
        serving: item.porcao,
        priceLabel: `Adicionar ao carrinho - R$ ${item.preco.toFixed(2)}`,
    }));

    return (
        <>
            <ProfileHero
                title={restaurante.titulo}
                cuisine={restaurante.tipo}
                backgroundImage={restaurante.capa}
            />
            <RestaurantMenu dishes={dishes} />
        </>
    );
};

export default Categories;
