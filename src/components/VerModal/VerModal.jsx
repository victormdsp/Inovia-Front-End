import { useState } from "react";
import { Box, Button, Modal } from "@mui/material";
import BoxStyle from "../../styles/BoxModal";

export default function VerPedido(props) {
    const [openUpdate, openViewUpdate] = useState(false);

    const montagemProdutos = (value, index) => {

        const val = props.pedido.quantporproduto[index].quantidade;

        return <div className="produto" key={index}>
            <div>
                <h2>{value.nome}</h2>
                <img className="produtoImage" src={value.imagem} alt="Foto do produto" />
            </div>
            <div>
                <h3>Preço: R${value.preco}</h3>
                <h3>Marca: {value.marca}</h3>
                <div>
                    <h3>Quantidade pedida: {val}</h3>
                </div>
            </div>
        </div>
    }

    return (
        <div>
            <Button variant="contained" color="info" onClick={() => openViewUpdate(true)}>Ver Pedido</Button>
            <Modal className="flexCenter" open={openUpdate}>
                <Box sx={BoxStyle}>
                    <Button variant="contained" color="info" onClick={() => openViewUpdate(false)}>X</Button>
                    <div className="mainDiv">
                        {props.pedido.produtos.map((value, index) => montagemProdutos(value, index))}
                    </div>
                </Box>
            </Modal>
        </div>
    )
}