import TicketDao from "../dao/ticket.dao.js";

const ticketDao = new TicketDao();

export const createTicket = async (req, res) => {
    try {
        const ticketData = req.body;
        const newTicket = await ticketDao.createTicket(ticketData);
        res.status(201).json(newTicket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};