import TicketModel from '../dao/mongodb/models/ticket.model.js';

class TicketDao {
    async createTicket(ticketData) {
        try {
            const ticket = new TicketModel(ticketData);
            await ticket.save();
            return ticket;
        } catch (error) {
            throw new Error('Error al crear el ticket: ' + error.message);
        }
    }
}

export default TicketDao;