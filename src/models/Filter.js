/*
 * A simple model for capture filter
 */

export const ALL_SPECIES = 'ALL_SPECIES';
export const SPECIES_ANY_SET = 'SPECIES_ANY_SET';
export const SPECIES_NOT_SET = 'SPECIES_NOT_SET';
export const ALL_ORGANIZATIONS = 'ALL_ORGANIZATIONS';
export const ORGANIZATION_NOT_SET = 'ORGANIZATION_NOT_SET';
export const TAG_NOT_SET = 'TAG_NOT_SET';
export const ANY_TAG_SET = 'ANY_TAG_SET';
import { tokenizationStates } from '../common/variables';

export default class Filter {
  uuid; //  id
  captureId;
  dateStart; //  startDate
  dateEnd; //  endDate
  planterId; //  grower_account_id
  deviceIdentifier; //  device_identifier
  planterIdentifier; //  wallet
  speciesId; //  species_id
  tagId;
  organizationId; //  organization_id
  tokenId;
  status; // status

  // NEW FILTERS TO ADD
  //  tree_associated
  //  tree_id
  //  tag
  //  token
  //  sort: { order: string, order_by: string };

  constructor(options) {
    Object.assign(this, options);
  }

  getWhereObj() {
    let where = {};

    if (this.uuid) {
      where.id = this.uuid;
    }

    if (this.captureId) {
      where.reference_id = this.captureId;
    }

    if (this.dateStart) {
      where.startDate = this.dateStart;
    }

    if (this.dateEnd) {
      where.endDate = this.dateEnd;
    }

    if (this.deviceIdentifier) {
      where.device_identifier = this.deviceIdentifier;
    }

    if (this.planterIdentifier) {
      where.wallet = this.planterIdentifier;
    }

    if (this.speciesId === SPECIES_NOT_SET) {
      where.species_id = null;
    } else if (this.speciesId !== ALL_SPECIES) {
      where.species_id = this.speciesId;
    }

    if (this.tag) {
      where.tag = this.tag;
    }

    if (this.tagId === TAG_NOT_SET) {
      where.tag = null;
    } else if (this.tagId === ANY_TAG_SET) {
      where.tag = '0';
    } else if (this.tagId) {
      where.tag = this.tagId;
    }

    if (this.organizationId === ORGANIZATION_NOT_SET) {
      where.organization_id = null;
    } else if (this.organizationId !== ALL_ORGANIZATIONS) {
      where.organization_id = this.organizationId;
    }

    if (this.status) {
      where.status = this.status;
    }

    if (this.growerAccountId) {
      where.grower_account_id = this.growerAccountId;
    }

    if (this.tokenId && this.tokenId !== 'All') {
      where.tokenized =
        this.tokenId === tokenizationStates.TOKENIZED ? 'true' : 'false';
    } else {
      delete where.tokenized;
    }

    let orCondition = false;
    const { ...restFilter } = where;

    if (this.planterId) {
      const planterIds = this.planterId.split(',').map((item) => item.trim());

      if (planterIds.length === 1) {
        restFilter.grower_account_id = this.planterId;
      } else {
        if (!orCondition) {
          orCondition = true;
          where = [];
        }
        planterIds.forEach((planterId) => {
          if (planterId) {
            where.push({
              grower_account_id: planterId,
            });
          }
        });
      }
    }

    return orCondition
      ? { ...restFilter, or: where }
      : { ...restFilter, ...where };
  }

  /*
   * A fn for array, to filter the data in memory, means, just use current
   * filter setting to filter an array
   * usage: someArray.filter(thisFilter.filter)
   * Note, not support start/end date yet.
   */
  filter = (element) => {
    if (this.status !== undefined && this.status !== element.status) {
      return false;
    } else {
      return true;
    }
  };

  /*
   * A fn to count the number of current applied filters
   */
  countAppliedFilters() {
    let numFilters = 0;

    if (this.uuid) {
      numFilters += 1;
    }

    if (this.captureId) {
      numFilters += 1;
    }

    if (this.wallet) {
      numFilters += 1;
    }

    if (this.device_identifier) {
      numFilters += 1;
    }

    if (this.planter_id) {
      numFilters += 1;
    }

    if (this.planter_identifier) {
      numFilters += 1;
    }

    if (this.tagId > 0) {
      numFilters += 1;
    }

    if (this.tag > 0) {
      numFilters += 1;
    }

    if (this.dateStart || this.dateEnd) {
      numFilters += 1;
    }

    if (this.organization_id && this.organization_id !== ALL_ORGANIZATIONS) {
      numFilters += 1;
    }

    if (this.species_id && this.species_id !== ALL_SPECIES) {
      numFilters += 1;
    }

    if (this.tokenId && this.tokenId !== 'All') {
      numFilters += 1;
    }

    if (this.status) {
      numFilters += 1;
    }

    if (this.growerAccountId) {
      numFilters += 1;
    }

    return numFilters;
  }
}
