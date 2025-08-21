import { Order } from '../models/Order';
export interface PaginatedOrders {
  orders: Order[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}