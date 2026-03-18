import {
  List,
  ListSection,
  MenuButton,
  MenuCard,
  MenuDescription,
  MenuImage,
  MenuTitle
} from './styles'

export type Dish = {
  id: number
  title: string
  description: string
  image: string
}

type Props = {
  dishes: Dish[]
}

const RestaurantMenu = ({ dishes }: Props) => (
  <ListSection>
    <div className="container">
      <List>
        {dishes.map((dish) => (
          <MenuCard key={dish.id}>
            <MenuImage src={dish.image} alt={dish.title} />
            <MenuTitle>{dish.title}</MenuTitle>
            <MenuDescription>{dish.description}</MenuDescription>
            <MenuButton type="button">Adicionar ao carrinho</MenuButton>
          </MenuCard>
        ))}
      </List>
    </div>
  </ListSection>
)

export default RestaurantMenu
