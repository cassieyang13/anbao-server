import { PaginationProps } from 'antd/lib/pagination';

export interface ComitListData {
  comitName: string;
  comitLocation: string;
  vehicleIds: any[];
  pledgePrice: number | string;
  openType: any[];
  tempPrice: number | string;
  comitId: number;
}

export interface ITableData<T> {
  list: T[];
}
