import axios from 'axios';



// 📦 Envia pedido
export async function sendOrder(order, token) {
    try {
        if (!token) {
            console.error('🚫 Token inválido! ❌');
            throw new Error('⚠️ Token não fornecido.');
        }

        const res = await axios.post(`${import.meta.env.VITE_BASE_URL_API}:${import.meta.env.VITE_API_PORT}/orders/create`, { order }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res || !res.data) {
            throw new Error('⚠️ Erro: Pedido não retornado corretamente da API.');
        }

        console.log('✅ Pedido enviado com sucesso! 🎉', res.data);
        return res.data;

    } catch (error) {
        console.error('❌ Erro ao enviar pedido:', error.response?.data || error.message);
        throw new Error('🚨 Falha ao enviar pedido. Tente novamente.');
    }
}

// 📥 Busca todos os pedidos
// 📥 Busca todos os pedidos
export async function getAllOrdersService(token) {
    try {
        if (!token) {
            console.error('🚫 Token inválido! ❌');
            throw new Error('⚠️ Token não fornecido.');
        }

        const res = await axios.get(`${import.meta.env.VITE_BASE_URL_API}:${import.meta.env.VITE_API_PORT}/orders/getAll`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res || !res.data) {
            throw new Error('⚠️ Erro: Dados de pedidos não retornados.');
        }

        const orders = res.data.orders;

        if (!orders || orders.length === 0) {
            console.info('ℹ️ Não existe nenhum pedido em andamento.');
            return { orders: [] }; // Ou qualquer estrutura vazia que seu front espera
        }

        console.log(`📦 ${orders.length} pedidos encontrados! ✅`);
        return res.data;

    } catch (error) {
        console.error('❌ Erro ao buscar pedidos:', error.response?.data || error.message);
        throw error; // Rejoga o erro original sem criar uma mensagem falsa
    }
}


export async function updateOrderStatusService(orderId, newStatus, token) {
    try {
        const res = await axios.patch(`${import.meta.env.VITE_BASE_URL_API}:${import.meta.env.VITE_API_PORT}/orders/updateStatus/${orderId}`, {
            orderId,
            status: newStatus,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (!res || !res.data) {
            throw new Error('⚠️ Falha ao atualizar pedido.');
        }

        return res.data;
    } catch (error) {
        console.error('❌ Erro ao atualizar pedido:', error.response?.data || error.message);
        throw new Error('🚨 Não foi possível atualizar o status do pedido.');
    }
}

export async function deleteOrderService(orderId, token) {
    try {
        const res = await axios.delete(
            `${import.meta.env.VITE_BASE_URL_API}:${import.meta.env.VITE_API_PORT}/orders/delete/${orderId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!res || !res.data) {
            throw new Error('⚠️ Falha ao cancelar pedido.');
        }

        return res.data;
    } catch (error) {
        console.error('❌ Erro ao cancelar pedido:', error.response?.data || error.message);
        throw new Error('🚨 Não foi possível cancelar o pedido.');
    }
}