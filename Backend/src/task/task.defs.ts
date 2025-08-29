import {gql} from 'graphql-tag';

const taskDefs = gql `
  type Task {
    id: ID!
    title: String!
    description: String!
    status: String!
    dueDate: String!
  }

  type Query {
    tasks: [Task!]!
    task(id: ID!): Task
  }
    type Query {
    tasks: [Task!]!
}

  type Mutation {
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task!
    deleteTask(id: ID!): Boolean!
  }

  input CreateTaskInput {
    title: String!
    description: String!
    status: String!
    dueDate: String!
  }

  input UpdateTaskInput {
    title: String
    description: String
    status: String
    dueDate: String
  }
`;

export default taskDefs;