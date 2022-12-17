import { Alert, Button, Card, Snackbar } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import './Produtos.css'

import BoxStyle from "../../styles/BoxModal";

export default function ProdutosBox(props) {

    const [products, setProducts] = useState();
    const [listaCompra, setLista] = useState([]);
    const [error, setError] = useState(false);
    const [sucesso, setSucesso] = useState(false);
    const [pedidoId, setId] = useState();

    useEffect(() => {
        const requestOptions = {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        }

        fetch('http://localhost:3001/getAllProducts', requestOptions)
            .then(async (response) => {
                const data = await response.json()
                setProducts(data)
            })
            .catch(err => {
                console.log(err.message);
            })
    }, [])

    useEffect(() => {
        if (props.pedidoEditar) {
            const aux = [];
            props.pedidoEditar.produtos.forEach((value, index) => {
                aux.push({ produtoInfo: value, quantidade: props.pedidoEditar.quantporproduto[index].quantidade });
            setId(props.pedidoEditar.id);
            })

            setLista([...aux]);
        }
    }, [])

    //Adiciona um item a lista
    const addItemList = (value, index) => {
        let aux = listaCompra;
        if (aux.length == 0) aux.push({ produtoInfo: value, quantidade: 1 })
        else {
            const indexResp = aux.findIndex(product => product.produtoInfo._id == value._id);
            if (indexResp >= 0) aux[indexResp].quantidade++;
            else aux.push({ produtoInfo: value, quantidade: 1 })
        }

        setLista([...aux]);
    }

    //Remove um item da lista
    const removeItemList = (value, index) => {
        let aux = listaCompra;
        if (aux.length == 0) return
        else {
            const indexResp = aux.findIndex(product => product.produtoInfo._id == value._id);

            if (indexResp >= 0) {
                if (aux[indexResp].quantidade == 0) aux.splice(indexResp, 1);
                else { aux[indexResp].quantidade--; }
            }
        }

        setLista([...aux]);
    }

    //Cria um novo pedido
    const createPedido = () => {
        const produtoFinal = {
            valorTotal: 0,
            totalProdutos: 0,
            produtos: [],
            quantidadePorProduto: []
        }

        listaCompra.forEach((value, index) => {
            produtoFinal.totalProdutos += value.quantidade;
            produtoFinal.valorTotal += parseFloat(value.produtoInfo.preco) * value.quantidade;
            produtoFinal.produtos.push(value.produtoInfo);
            produtoFinal.quantidadePorProduto.push({ produtoID: value.produtoInfo._id, quantidade: value.quantidade });
        })

        const data = getTodayDate();

        const requestOption = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                clientid: props.user.id,
                produtos: produtoFinal.produtos,
                quantPorProduto: produtoFinal.quantidadePorProduto,
                totalProdutos: produtoFinal.totalProdutos,
                dataPedido: data,
                totalPedido: produtoFinal.valorTotal
            })
        }

        fetch('http://localhost:3001/pedidos/createPedido', requestOption)
            .then(async (response) => {
                const data = await response.json();
                if (data) {
                    setSucesso(true);
                    const sanitizedData = dataSanitizer(data);
                    props.closeModal(sanitizedData);
                }

            })
            .catch(err => {
                setError(true);
            })
    }

    //Edita um pedido
    const editarPedido = () => {
        const produtoFinal = {
            valorTotal: 0,
            totalProdutos: 0,
            produtos: [],
            quantidadePorProduto: []
        }

        listaCompra.forEach((value, index) => {
            produtoFinal.totalProdutos += value.quantidade;
            produtoFinal.valorTotal += parseFloat(value.produtoInfo.preco) * value.quantidade;
            produtoFinal.produtos.push(value.produtoInfo);
            produtoFinal.quantidadePorProduto.push({ produtoID: value.produtoInfo._id, quantidade: value.quantidade });
        })

        const auxDate = new Date();
        const data = auxDate.getDay() + '/' + auxDate.getMonth() + '/' + auxDate.getFullYear().toString().slice(0, 2);

        const requestOption = {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                clientid: props.user.id,
                produtos: produtoFinal.produtos,
                quantPorProduto: produtoFinal.quantidadePorProduto,
                totalProdutos: produtoFinal.totalProdutos,
                dataPedido: data,
                totalPedido: produtoFinal.valorTotal
            })
        }

        fetch(`http://localhost:3001/pedidos/updatePedido/${props.pedidoEditar.id}`, requestOption)
            .then(async (response) => {
                const data = await response.json();
                if (data) {
                    const sanitizedData = dataSanitizer(data);
                    props.closeModalEditar(sanitizedData);
                    setSucesso(true);
                }

            })
            .catch(err => {
                setError(true);
            })
    }

    const getTodayDate = () => {
        const auxDate = new Date();
        const data = auxDate.getDay() + '/' + auxDate.getMonth() + '/' + auxDate.getFullYear().toString().slice(0, 2);
        return data;
    }

    //Limpa e organiza os dados
    const dataSanitizer = (data) => {
        const dataSanitizada = {
            clientid: data.clientid,
            produtos: data.produtos,
            quantporproduto: data.quantPorProduto,
            totalprodutos: data.totalProdutos,
            datapedido: data.dataPedido,
            totalpedido: data.totalPedido
        }

        return dataSanitizada;
    }

    const montagemProducts = (value, index) => {
        return (
            <div key={index} className="produto">
                <div>
                    <h2>{value.nome}</h2>
                    <img className="produtoImage" src={value.imagem} alt="Foto do produto" />
                </div>
                <div>
                    <h3>Preço: R${value.preco}</h3>
                    <h3>Marca: {value.marca}</h3>
                    <h3>Quantidade em estoque: {value.quantEstoque}</h3>
                    <div className="flexCenter pedidoButtons">
                        <Button onClick={() => addItemList(value, index)} variant="contained" color="info">+</Button>
                        <Button onClick={() => removeItemList(value, index)} variant="contained" color="info">-</Button>
                    </div>
                </div>
            </div>
        )
    }

    const montagemListaPedido = (value, index) => {
        return <div key={index} className='listaBox'>
            <h3>Nome do produto: {value.produtoInfo.nome}</h3>
            <h3>Quantidade do produto: {value.quantidade}</h3>
        </div>
    }

    return (
        <div className="mainDiv">
            {products ? products.map((value, index) => montagemProducts(value, index)) : "Não há nenhum produto a venda"}
            {props.update ?
                <Button onClick={() => editarPedido()} variant="contained" color="info">Editar pedido</Button>
                : <Button onClick={() => createPedido()} variant="contained" color="info">Finalizar pedido</Button>}

            <div className="listaPedidos">
                <Box sx={BoxStyle}>
                    <div>
                        <h4 className="titleList">Lista de Pedidos</h4>
                        <div className="produtos">
                            {listaCompra ? listaCompra.map((value, index) => montagemListaPedido(value, index)) : <p>Vazia</p>}
                        </div>
                    </div>
                </Box>
            </div>
            <Snackbar open={sucesso} anchorOrigin={{ vertical: 'center', horizontal: 'center' }} autoHideDuration={4000} onClose={() => setSucesso(false)}>
                <Alert severity="success">Pedido feito.</Alert>
            </Snackbar>
            <Snackbar open={error} anchorOrigin={{ vertical: 'center', horizontal: 'center' }} autoHideDuration={4000} onClose={() => setError(false)}>
                <Alert severity="error">Não foi possível fazer o pedido, tente novamente mais tarde.</Alert>
            </Snackbar>
        </div>

    )
}