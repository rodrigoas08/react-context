import { createContext, useContext, useState } from "react";

export const CarrinhoContext = createContext();
CarrinhoContext.displayName = "Carrinho";

export const CarrinhoProvider = ({ children }) => {
	const [carrinho, setCarrinho] = useState([]);

	function AdicionarProduto(novoProduto) {
		const temOproduto = carrinho.some(
			(itemDoCarrinho) => itemDoCarrinho.id === novoProduto.id
		);

		if (!temOproduto) {
			novoProduto.quantidade = 1;
			return setCarrinho((carrinhoAnterior) => [
				...carrinhoAnterior,
				novoProduto,
			]);
		}
		setCarrinho((carrinhoAnterior) =>
			carrinhoAnterior.map((itemDoCarrinho) => {
				if (itemDoCarrinho.id === novoProduto.id)
					itemDoCarrinho.quantidade += 1;
				return itemDoCarrinho;
			})
		);
	}

	return (
		<CarrinhoContext.Provider
			value={{ carrinho, setCarrinho, AdicionarProduto }}
		>
			{children}
		</CarrinhoContext.Provider>
	);
};

export const useCarrinhoContext = () => {
	const { carrinho, setCarrinho, AdicionarProduto } =
		useContext(CarrinhoContext);

	return { carrinho, setCarrinho, AdicionarProduto };
};
