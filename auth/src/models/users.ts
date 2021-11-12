import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describes props required to create a user
interface UserAttrs {
  email: string;
  password: string;
}

//an interface describes props user models has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// an interface describes props that a single user document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

//actual User schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', async function (done) {
  // only hash when pass modified
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

// enforce type checking
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
