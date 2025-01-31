import React, { Component } from 'react';
import DataTable from '../../components/DataTable';
import './index.css';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from '../../components/CircularProgress';
import UnDelegateButton from '../Home/TokenDetails/UnDelegateButton';
import ReDelegateButton from '../Home/TokenDetails/ReDelegateButton';
import DelegateButton from './DelegateButton';
import { formatCount } from '../../utils/numberFormats';
import ValidatorName from './ValidatorName';
import { config } from '../../config';
import ConnectButton from '../NavBar/ConnectButton';
import classNames from 'classnames';

class Table extends Component {
    randomNoRepeats (array = []) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    render () {
        const options = {
            serverSide: false,
            print: false,
            fixedHeader: false,
            pagination: false,
            selectableRows: 'none',
            selectToolbarPlacement: 'none',
            textLabels: {
                body: {
                    noMatch: this.props.inProgress
                        ? <CircularProgress/>
                        : !this.props.address
                            ? <ConnectButton/>
                            : <div className="no_data_table"> No data found </div>,
                    toolTip: 'Sort',
                },
                viewColumns: {
                    title: 'Show Columns',
                    titleAria: 'Show/Hide Table Columns',
                },
            },
        };

        const columns = [{
            name: 'validator',
            label: 'Validator',
            options: {
                sort: true,
                customBodyRender: (value, index) => (
                    <ValidatorName index={index && index.rowIndex} name={value} value={index.rowData && index.rowData.length && index.rowData[1]}/>
                ),
            },
        }, {
            name: 'status',
            label: 'Status',
            options: {
                sort: false,
                customBodyRender: (value) => {
                    return (
                        <div
                            className={classNames('status', value.jailed ? 'red_status' : '')}
                            title={value.status === 'BOND_STATUS_UNBONDING' ? 'unbonding'
                                : value.status === 'BOND_STATUS_UNBONDED' ? 'unbonded'
                                    : value.status === 'BOND_STATUS_BONDED' ? 'active' : ''}>
                            {value.status === 'BOND_STATUS_UNBONDING' ? 'unbonding'
                                : value.status === 'BOND_STATUS_UNBONDED' ? 'unbonded'
                                    : value.status === 'BOND_STATUS_BONDED' ? 'active' : ''}
                        </div>
                    );
                },
            },
        }, {
            name: 'voting_power',
            label: 'Voting Power',
            options: {
                sort: true,
                customBodyRender: (value) => (
                    <div className="voting_power">
                        <p>{formatCount(value, true)}</p>
                    </div>
                ),
            },
        },
        {
            name: 'commission',
            label: 'Commission',
            options: {
                sort: true,
                customBodyRender: (value) => (
                    value ? value + '%' : '0%'
                ),
            },
        }, {
            name: 'tokens_staked',
            label: 'Tokens Staked',
            options: {
                sort: false,
                customBodyRender: (item) => {
                    // not sure if this is right, but close enough
                    let value = Number(item.tokens);
                    value = value / 10 ** config.COIN_DECIMALS;

                    return (
                        <div className={value ? 'tokens' : 'no_tokens'}>
                            {value || 'no tokens'}
                        </div>
                    );
                },
            },
        }, {
            name: 'action',
            label: 'Action',
            options: {
                sort: false,
                customBodyRender: (validatorAddress) => (
                    this.props.delegations.find((item) =>
                        (item.delegation && item.delegation.validator_address) === validatorAddress)
                        ? <div className="actions">
                            <ReDelegateButton valAddress={validatorAddress}/>
                            <span/>
                            <UnDelegateButton valAddress={validatorAddress}/>
                            <span/>
                            <DelegateButton valAddress={validatorAddress}/>
                        </div>
                        : <div className="actions">
                            <DelegateButton valAddress={validatorAddress}/>
                        </div>
                ),
            },
        }]
        ;

        const dataToMap = this.props.active === 2 ? this.props.delegatedValidatorList
            : this.randomNoRepeats(this.props.validatorList);

        const tableData = dataToMap && dataToMap.length
            ? dataToMap.map((item) =>
                [
                    item.description && item.description.moniker,
                    item,
                    parseFloat((Number(item.tokens) / (10 ** config.COIN_DECIMALS)).toFixed(1)),
                    item.commission && item.commission.commission_rates &&
                    item.commission.commission_rates.rate
                        ? parseFloat((Number(item.commission.commission_rates.rate) * 100).toFixed(2)) : null,
                    item,
                    item.operator_address,
                ])
            : [];

        return (
            <div className="table">
                <DataTable
                    columns={columns}
                    data={tableData}
                    name="stake"
                    options={options}/>
            </div>
        );
    }
}

Table.propTypes = {
    active: PropTypes.number.isRequired,
    inProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    address: PropTypes.string,
    delegatedValidatorList: PropTypes.arrayOf(
        PropTypes.shape({
            operator_address: PropTypes.string,
            status: PropTypes.string,
            tokens: PropTypes.string,
            commission: PropTypes.shape({
                commission_rates: PropTypes.shape({
                    rate: PropTypes.string,
                }),
            }),
            delegator_shares: PropTypes.string,
            description: PropTypes.shape({
                moniker: PropTypes.string,
            }),
        }),
    ),
    delegations: PropTypes.arrayOf(
        PropTypes.shape({
            validator_address: PropTypes.string,
            balance: PropTypes.shape({
                amount: PropTypes.any,
                denom: PropTypes.string,
            }),
        }),
    ),
    home: PropTypes.bool,
    validatorList: PropTypes.arrayOf(
        PropTypes.shape({
            operator_address: PropTypes.string,
            status: PropTypes.string,
            tokens: PropTypes.string,
            commission: PropTypes.shape({
                commission_rates: PropTypes.shape({
                    rate: PropTypes.string,
                }),
            }),
            delegator_shares: PropTypes.string,
            description: PropTypes.shape({
                moniker: PropTypes.string,
            }),
        }),
    ),
};

const stateToProps = (state) => {
    return {
        address: state.accounts.address.value,
        lang: state.language,
        validatorList: state.stake.validators.list,
        inProgress: state.stake.validators.inProgress,
        delegations: state.accounts.delegations.result,
        delegatedValidatorList: state.stake.delegatedValidators.list,
    };
};

export default connect(stateToProps)(Table);
