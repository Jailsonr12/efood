import styled from 'styled-components'

import { cores } from '../../styles'

export const ListSection = styled.section`
  padding-top: 52px;
  padding-bottom: 40px;
`

export const List = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 42px;
  row-gap: 32px;

  @media (max-width: 1023px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`

export const MenuCard = styled.li`
  background-color: ${cores.vermelho};
  padding: 8px;
`

export const MenuImage = styled.img`
  width: 100%;
  height: 167px;
  object-fit: cover;
  display: block;
`

export const MenuTitle = styled.h3`
  margin-top: 8px;
  color: ${cores.vermelhoClaro};
  font-size: 16px;
  font-weight: 700;
`

export const MenuDescription = styled.p`
  margin-top: 8px;
  margin-bottom: 8px;
  color: ${cores.vermelhoClaro};
  font-size: 14px;
  line-height: 22px;
`

export const MenuButton = styled.button`
  width: 100%;
  height: 24px;
  border: none;
  background-color: ${cores.vermelhoClaro};
  color: ${cores.vermelho};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`
