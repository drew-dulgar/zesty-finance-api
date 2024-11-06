import type { ZestyFinanceDB, AccountPlanSelectable, AccountPlansPlanJson } from '../repositories/zesty-finance-db.js';


import { AccountPlanRepository } from '../repositories/index.js';
import { selectableToCamel } from '../utils/objects.js';

export type AccountPlan = {
  id?: number;
  label?: string;
  description?: string | null;
  plan?: AccountPlansPlanJson;
  priceMonthly?: number | null;
  priceYearly?: number | null;
  isDefault?: boolean;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

const getDefaultPlan = async (): Promise<AccountPlan> => {
  const accountPlan = await AccountPlanRepository.get({
    where: {
      isDefault: true,
      isDeleted: false
    },
    limit: 1,
  }).executeTakeFirstOrThrow();

  return selectableToCamel<AccountPlanSelectable, AccountPlan>(accountPlan);
}

export default { 
  getDefaultPlan,
}