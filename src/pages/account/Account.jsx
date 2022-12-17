import React, { useEffect, useState } from "react";
import { Box, Button, Card, ListItemText, Modal } from "@mui/material";
import { useLocation } from "react-router-dom";
import ProdutosBox from "../../components/Produtos/ProdutosBox";
import './Account.css';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Stack } from "@mui/system";
import BoxStyle from '../../styles/BoxModal'
import VerPedido from "../../components/VerModal/VerModal";

export default function Account() {
    const location = useLocation();
    const userInfos = location.state;


    const [pedidos, setPedidos] = useState();
    const [openModal, setModalOpen] = useState(false);

    useEffect(() => {
        const requestOptions = {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        }

        fetch(`http://localhost:3001/pedidos/getMeusPedidos/${userInfos.id}`, requestOptions)
            .then(async (response) => {
                const data = await response.json()
                if (data.message) setPedidos(false);
                else setPedidos(data)
            })
            .catch(err => {
                console.log(err.message);
            })
    }, [])

    const atualizaPedidos = (pedido) => {
        console.log("Entrou aqui")
        if (!pedidos) {
            pedidos = []
        };

        pedidos.push(pedido);
        setPedidos([...pedidos])
        setModalOpen(false);

    }

    const editarPedido = (pedido, indexPedido) => {
        if(pedidos) {
            const index = pedidos.find(pedidoArray => pedidoArray.id == indexPedido)
            pedidos[index] = pedido;
            setPedidos([...pedidos]);
        }
    }

    const removePedido = (index) => {
        if (pedidos && pedidos.length > 0) {
            pedidos.splice(index, 1);
        }
        setPedidos([...pedidos]);
    }

    const boxPedidos = (value, index) => {
        return <Card key={index} className="boxPedido">
            <ListItemText>Cliente: {userInfos.nome}</ListItemText>
            <ListItemText>Total do valor do pedido: R${value.totalpedido}</ListItemText>
            <ListItemText>Total de produtos do pedido: {value.totalprodutos}</ListItemText>
            <ListItemText>Data do pedido: {value.datapedido.slice(0, 10)}</ListItemText>
            <div className="flexCenter pedidoButtons">
                <VerPedido pedido={value}></VerPedido>
                <EditarLista user={userInfos} atualizar={editarPedido} pedidoEditar={value}></EditarLista>
                <CancelarModal pedido={value} pedidoIndex={index} remove={removePedido}></CancelarModal>
            </div>
        </Card>
    }


    return (
        <div className="accountBody">
            <Header></Header>
            <div className="accountMain">
                <h1>Meus pedidos</h1>
                <Stack direction='column' spacing={2} alignItems="center" justifyContent="center" className="stackPedidos">{pedidos ? pedidos.map((value, index) => boxPedidos(value, index))
                    : <h1 className="emptyPedido">Você não possui nenhum pedido!</h1>}</Stack>

                <Button variant="contained" color="info" onClick={() => setModalOpen(true)}>Fazer um novo pedido</Button>
                <Modal open={openModal} className="flexCenter">
                    <Box sx={BoxStyle}>
                        <Button onClick={() => setModalOpen(false)} className="closeButton" variant="contained" color="info">X</Button>
                        <ProdutosBox user={userInfos} closeModal={atualizaPedidos} />
                    </Box>
                </Modal>

            </div>
            <Footer></Footer>
        </div>
    )
}

function CancelarModal(props) {
    const [cancelarModal, openCancelarModal] = useState(false);

    const cancelar = () => {
        const requestOptions = {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' }
        }

        fetch(`http://localhost:3001/pedidos/deletePedido/${props.pedido.id}`, requestOptions)
            .then(() => {
                openCancelarModal(false);
                props.remove(props.pedidoIndex)
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    return (
        <div>
            <Button variant="contained" color="error" onClick={() => openCancelarModal(true)}>Cancelar</Button>
            <Modal open={cancelarModal} className="flexCenter">
                <Box sx={BoxStyle}>
                    <div className="mainDiv">
                        <h1>Tem certeza que deseja cancelar o pedido?</h1>
                        <div className="flexCenter pedidoButtons">
                            <Button variant="contained" color="info" onClick={() => cancelar()}>Sim</Button>
                            <Button variant="contained" color="error" onClick={() => openCancelarModal(false)}>Não</Button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

function EditarLista(props) {
    const [openModal, setModalOpen] = useState(false);
    
    const atualizar = (pedido) => {
        props.atualizar(pedido, props.pedidoEditar.id);
        setModalOpen(false);
    }

    return (
        <div>
            <Button variant="contained" color="secondary" onClick={() => setModalOpen(true)}>Editar pedido</Button>
            <Modal open={openModal} className="flexCenter">
                <Box sx={BoxStyle}>
                    <Button onClick={() => setModalOpen(false)} className="closeButton" variant="contained" color="info">X</Button>
                    <ProdutosBox user={props.user} update={true} pedidoEditar={props.pedidoEditar} closeModalEditar={atualizar} />
                </Box>
            </Modal>
        </div>
    )
}