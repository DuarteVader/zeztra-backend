import { ObjectId } from 'mongodb'
import { Schema, model, Document } from 'mongoose'

interface IMovementsDocument extends Document {
  _id: ObjectId
  uuid: string
  nome: string
  cpfCnpj: string
  user: ObjectId
  data: string
  valor: string
}

const movimentSchema = new Schema<IMovementsDocument>(
  {
    uuid: { type: String, required: true },
    nome: { type: String, required: true },
    cpfCnpj: { type: String, required: true },
    data: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'Users' },
    valor: { type: String, required: true },
  },
  { timestamps: true }
)

const Movements = model<IMovementsDocument>('Movements', movimentSchema)

export { IMovementsDocument, Movements }
