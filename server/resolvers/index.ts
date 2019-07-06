import { merge } from 'lodash';
import userResolvers from '../resolvers/user';
import messageResolvers from '../resolvers/message';

export default merge(userResolvers, messageResolvers);
