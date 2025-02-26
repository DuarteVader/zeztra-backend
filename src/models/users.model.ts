import { ObjectId } from 'mongodb'
import { Schema, model, Document } from 'mongoose'

interface IUsersDocument extends Document {
  _id: ObjectId
  nome: string
  cpfCnpj: string
}

const userSchema = new Schema<IUsersDocument>(
  {
    nome: { type: String, required: true },
    cpfCnpj: { type: String, required: true },
  },
  { timestamps: true }
)

const Users = model<IUsersDocument>('Users', userSchema)

export { IUsersDocument, Users }
