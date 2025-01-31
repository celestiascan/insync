import { config } from '../config';

export const REST_URL = config.REST_URL;
export const RPC_URL = config.RPC_URL;

export const urlFetchDelegations = (address) => `${REST_URL}/cosmos/staking/v1beta1/delegations/${address}`;
export const urlFetchBalance = (address) => `${REST_URL}/cosmos/bank/v1beta1/balances/${address}`;
export const urlFetchVestingBalance = (address) => `${REST_URL}/auth/accounts/${address}`; // ??
export const urlFetchUnBondingDelegations = (address) => `${REST_URL}/cosmos/staking/v1beta1/delegators/${address}/unbonding_delegations`;

export const urlFetchRewards = (address) => `${REST_URL}/distribution/delegators/${address}/rewards`; // removed
export const urlFetchVoteDetails = (proposalId, address) => `${REST_URL}/cosmos/gov/v1beta1/proposals/${proposalId}/votes/${address}`;

export const VALIDATORS_LIST_URL = `${REST_URL}/cosmos/staking/v1beta1/validators`;
export const getValidatorURL = (address) => `${REST_URL}/cosmos/staking/v1beta1/validators/${address}`;
export const PROPOSALS_LIST_URL = `${REST_URL}/cosmos/gov/v1beta1/proposals`;
export const getDelegatedValidatorsURL = (address) => `${REST_URL}/cosmos/staking/v1beta1/delegators/${address}/validators`;
export const urlFetchProposalVotes = (id) => `${REST_URL}/cosmos/gov/v1beta1/proposals/${id}/votes`;
export const urlFetchTallyDetails = (id) => `${REST_URL}/cosmos/gov/v1beta1/proposals/${id}/tally`;
export const urlFetchProposalDetails = (id) => `${REST_URL}/cosmos/tx/v1beta1/txs?message.module=governance&submit_proposal.proposal_id=${id}`;

export const validatorImageURL = (id) => `https://keybase.io/_/api/1.0/user/lookup.json?fields=pictures&key_suffix=${id}`;
