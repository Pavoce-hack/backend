import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Invoice {
    _id: ID!
    userId: String!
    invoiceAddress: String!
    amount: Float!
    currency: String!
    paymentType: String!
    status: String!
    clientName: String!
    clientEmail: String!
    services: [Service]!
    startDate: String!
    endDate: String!
  }

  input InvoiceInput {
    invoiceAddress: String!
    userId: String!
    amount: Float!
    currency: String!
    paymentType: String!
    status: String!
    clientName: String!
    clientEmail: String!
    services: [ServiceInput]!
    startDate: String!
    endDate: String!
  }

  type Query {
    invoices: [Invoice!]!
    invoice(invoiceAddress: String!): Invoice!
    invoiceById(_id: ID!): Invoice!
  }

  type Service {
    title: String!
    description: String!
    quantity: Float!
    rate: Float!
  }

  input ServiceInput {
    title: String!
    description: String!
    quantity: Float!
    rate: Float!
  }

  type Mutation {
    createInvoice(input: InvoiceInput!): Invoice!
    updateInvoice(_id: ID!, input: InvoiceInput): Invoice!
    deleteInvoice(_id: ID!): Invoice!
  }
`;

export default typeDefs;
