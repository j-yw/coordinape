import React, { useState, useMemo } from 'react';

import { NavLink } from 'react-router-dom';

import { makeStyles, Button, IconButton, Avatar } from '@material-ui/core';

import { StaticTableNew } from 'components';
import { useAdminApi, useMe } from 'hooks';
import { DeleteIcon, PlusCircleIcon, DownArrow, InfoIcon } from 'icons';
import { useSelectedCircle, useSelectedCircleEpochs } from 'recoilState';
import { getAdminNavigation, checkActive } from 'routes/paths';

// eslint-disable-next-line import/no-named-as-default
import AdminUserModal from './AdminUserModal';

import { IUser, IEpoch, ITableColumn } from 'types';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(0, 8, 4),
    margin: 'auto',
    maxWidth: theme.breakpoints.values.lg,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 2, 4),
    },
  },
  topMenu: {
    height: 120,
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: '1fr 1fr',
    padding: theme.spacing(0, 4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0, 2),
      gridTemplateColumns: '1fr 1fr',
    },
    '& > *': {
      alignSelf: 'center',
    },
    '& .MuiSkeleton-root': {
      marginLeft: theme.spacing(1.5),
    },
    '& .MuiSkeleton-rect': {
      borderRadius: 5,
    },
  },
  noVaults: {
    height: 434,
    display: 'grid',
    borderRadius: 8,
    background: theme.colors.ultraLightGray,
    alignItems: 'center',
    gridTemplateColumns: '1fr',
    padding: theme.spacing(0, 4),
    margin: theme.spacing(4, 0),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0, 2),
      gridTemplateColumns: '1fr',
    },
    '& > *': {
      alignSelf: 'center',
    },
    '& .MuiSkeleton-root': {
      marginLeft: theme.spacing(1.5),
    },
    '& .MuiSkeleton-rect': {
      borderRadius: 5,
    },
  },
  withVaults: {
    height: 434,
    display: 'grid',
    borderRadius: 8,
    background: theme.colors.ultraLightGray,
    alignItems: 'center',
    columnGap: theme.spacing(3),
    gridTemplateColumns: '1fr 1fr',
    padding: theme.spacing(0, 4),
    margin: theme.spacing(4, 0),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0, 2),
      gridTemplateColumns: '1fr',
    },
    '& > *': {
      alignSelf: 'center',
    },
    '& .MuiSkeleton-root': {
      marginLeft: theme.spacing(1.5),
    },
    '& .MuiSkeleton-rect': {
      borderRadius: 5,
    },
  },
  noVaultsInterior: {
    height: 288,
    display: 'flex',
    borderRadius: 8,
    background: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginTop: -80,
    gridTemplateColumns: '1fr',
    padding: theme.spacing(0, 1),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0, 2),
      gridTemplateColumns: '1fr',
    },
    '& > *': {
      alignSelf: 'center',
    },
    '& .MuiSkeleton-root': {
      marginLeft: theme.spacing(1.5),
    },
    '& .MuiSkeleton-rect': {
      borderRadius: 5,
    },
  },
  number: {
    color: theme.colors.black,
    fontSize: 24,
    margin: 0,
    fontWeight: 600,
    paddingRight: 8,
  },
  noVaultsTitle: {
    color: theme.colors.mediumGray,
    margin: 0,
    fontSize: 24,
    fontWeight: 600,
  },
  vaultsTitle: {
    color: theme.colors.mediumGray,
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    padding: 0,
    marginRight: '1em',
  },
  noVaultsSubtitle: {
    color: theme.colors.mediumGray,
    fontSize: 15,
    fontWeight: 300,
  },
  vaultsSecondary: {
    color: theme.colors.lightBlue,
    fontSize: 15,
    fontWeight: 300,
    margin: 0,
    padding: 0,
  },
  organizationLinks: {
    justifySelf: 'stretch',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  organizationLink: {
    margin: theme.spacing(0, 2),
    fontSize: 20,
    fontWeight: 700,
    color: theme.colors.white,
    textDecoration: 'none',
    padding: '6px 0',
    position: 'relative',
    '&::after': {
      content: `" "`,
      position: 'absolute',
      left: '50%',
      right: '50%',
      backgroundColor: theme.colors.mediumRed,
      transition: 'all 0.3s',
      bottom: 0,
      height: 2,
    },
    '&:hover': {
      '&::after': {
        left: 0,
        right: 0,
        backgroundColor: theme.colors.mediumRed,
      },
    },
    '&.active': {
      '&::after': {
        left: 0,
        right: 0,
        backgroundColor: theme.colors.red,
      },
      '&:hover': {
        '&::after': {
          left: 0,
          right: 0,
          backgroundColor: theme.colors.red,
        },
      },
    },
  },
  navLinks: {
    justifySelf: 'stretch',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttons: {
    justifySelf: 'end',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  navLink: {
    margin: theme.spacing(0, 2),
    fontSize: 20,
    fontWeight: 400,
    color: theme.colors.mediumGray,
    textDecoration: 'none',
    padding: theme.spacing(1, 2),
    position: 'relative',
    '&:hover': {
      backgroundColor: theme.colors.ultraLightGray,
      padding: theme.spacing(1, 2),
      borderRadius: '16px',
      color: theme.colors.text,
    },
    '&.active': {
      '&::after': {
        left: 0,
        right: 0,
        backgroundColor: theme.colors.ultraLightGray,
      },
      '&:hover': {
        '&::after': {
          left: 0,
          right: 0,
          backgroundColor: theme.colors.ultraLightGray,
        },
      },
    },
  },
  title: {
    textTransform: 'capitalize',
    fontSize: 40,
    lineHeight: 1.2,
    fontWeight: 700,
    color: '#000000',
    margin: theme.spacing(6, 0),
  },
  allocateBtn: {
    padding: '8px',
    height: 'calc(32px * 16) * 1rem',
  },
  actionsAndEpochs: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  actionBar: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'flex-start',
    margin: theme.spacing(0, 5, 4),
  },
  actionBarInner: {
    display: 'flex',
    flexDirection: 'column',
    width: '200px',
    '& > *': {
      marginBottom: theme.spacing(2),
    },
  },
  epochsTable: {
    flexGrow: 4,
    marginBottom: theme.spacing(8),
  },
  newTable: {
    flexGrow: 4,
    height: 288,
    marginTop: -80,
    paddingTop: 0,
  },
  userActionBar: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 70,
  },
  moreButton: {
    margin: 0,
    padding: theme.spacing(0, 1),
    minWidth: 20,
    fontSize: 17,
    fontWeight: 800,
    color: theme.colors.text,
  },
  searchInput: {
    margin: theme.spacing(0, 1),
    padding: theme.spacing(1),
    fontSize: 14,
    fontWeight: 500,
    textAlign: 'center',
    color: theme.colors.text,
    background: '#fff',
    border: 'none',
    borderRadius: 8,
    outline: 'none',
    '&::placeholder': {
      color: theme.colors.text,
    },
  },
  twoLineCell: {
    height: 48,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    fontSize: 11,
    lineHeight: 1.5,
  },
  twoLineCellTitle: {
    fontWeight: 600,
  },
  twoLineCellSubtitle: {
    fontWeight: 400,
  },
  avatar: {
    width: 32,
    height: 32,
    marginRight: theme.spacing(1),
  },
  avatarCell: {
    height: 48,
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    lineHeight: 1.5,
    fontWeight: 600,
  },
  tableActions: {
    display: 'flex',
    justifyContent: 'center',
  },
  errorColor: {
    color: theme.palette.error.main,
  },
  csvLink: {
    color: '#84C7CA',
    '&:hover': {
      color: '#4e7577',
    },
  },
  tablePlaceholderTitle: {
    fontSize: 20,
    lineHeight: 1.2,
    color: theme.colors.text,
    opacity: 0.7,
  },
  horizontalDisplay: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalValue: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  infoIcon: {
    height: 20,
    width: 20,
    marginBottom: 0,
  },
  valueBtn: {
    width: '110.3px',
    color: theme.colors.secondary,
    fontWeight: 600,
  },
  smallP: {
    fontSize: 12,
    marginLeft: '0.4em',
    padding: 0,
    margin: 0,
  },
}));

const epochDetail = (e: IEpoch) => {
  const r =
    e.repeatEnum === 'none'
      ? ''
      : e.repeatEnum === 'weekly'
      ? `${e.startDay} - ${e.endDay}`
      : 'monthly';
  return e.ended
    ? e.labelActivity
    : `${Math.floor(e.calculatedDays)} ${e.calculatedDays > 1 ? 'days' : 'day'}
        ${e.repeat ? `, repeats ${r}` : ''}`;
};

const AdminPage1 = () => {
  const classes = useStyles();
  const [editUser, setEditUser] = useState<IUser | undefined>(undefined);
  const [newUser, setNewUser] = useState<boolean>(false);
  const [, setEditEpoch] = useState<IEpoch | undefined>(undefined);
  const [, setNewEpoch] = useState<boolean>(false);
  const [, setEditCircle] = useState<boolean>(false);

  const { deleteEpoch } = useAdminApi();
  const selectedCircle = useSelectedCircle();
  const epochsReverse = useSelectedCircleEpochs();

  const epochs = useMemo(
    () => [
      {
        id: 1,
        number: 2,
        start_date: new Date('2021-10-07T00:55:35'),
        end_date: new Date('2021-10-21T20:57:00.000000Z'),
        circle_id: 1,
        created_at: new Date('2021-10-07T00:55:35.000000Z'),
        updated_at: new Date('2021-10-07T00:55:35.000000Z'),
        ended: false,
        notified_start: null,
        notified_before_end: null,
        notified_end: null,
        grant: 0.0,
        regift_days: 1,
        days: 4,
        repeat: 2,
        repeat_day_of_month: 7,
        repeatEnum: 'monthly',
        started: true,
        startDate: new Date('2021-10-07T00:55:35.000Z'),
        startDay: 'Thu',
        endDate: new Date('2021-10-21T20:57:00.000Z'),
        endDay: 'Thu',
        interval: {
          s: new Date('2021-10-07T00:55:35.000Z'),
          e: new Date('2021-10-21T20:57:00.000Z'),
        },
        invalid: null,
        isLuxonInterval: true,
        totalTokens: 0,
        uniqueUsers: 0,
        activeUsers: 0,
        calculatedDays: 14.83431712962963,
        labelGraph: 'This Epoch Oct 1 - 21',
        labelDayRange: 'Oct 7 to Oct 21',
        labelTimeStart: 'Started 12:55AM UTC',
        labelTimeEnd: 'Ends 12:55AM UTC',
        labelActivity: '',
        labelUntilStart: 'The Past',
        labelUntilEnd: '8 Days',
        labelYearEnd: '2021',
      },
      {
        id: 1,
        number: 4,
        start_date: new Date('2021-10-07T00:55:35'),
        end_date: new Date('2021-10-30T20:57:00.000000Z'),
        circle_id: 1,
        created_at: new Date('2021-10-01T00:55:35.000000Z'),
        updated_at: new Date('2021-10-07T00:55:35.000000Z'),
        ended: false,
        notified_start: null,
        notified_before_end: null,
        notified_end: null,
        grant: 0.0,
        regift_days: 1,
        days: 4,
        repeat: 2,
        repeat_day_of_month: 7,
        repeatEnum: 'monthly',
        started: true,
        startDate: new Date('2021-10-01T00:55:35.000Z'),
        startDay: 'Thu',
        endDate: new Date('2021-10-30T20:57:00.000Z'),
        endDay: 'Thu',
        interval: {
          s: new Date('2021-10-01T00:55:35.000Z'),
          e: new Date('2021-10-30T20:57:00.000Z'),
        },
        invalid: null,
        isLuxonInterval: true,
        totalTokens: 0,
        uniqueUsers: 0,
        activeUsers: 0,
        calculatedDays: 20,
        labelGraph: 'This Epoch Oct 1 - 30',
        labelDayRange: 'Oct 1 to Oct 30',
        labelTimeStart: 'Started 12:55AM UTC',
        labelTimeEnd: 'Ends 12:55AM UTC',
        labelActivity: '',
        labelUntilStart: 'The Past',
        labelUntilEnd: '8 Days',
        labelYearEnd: '2021',
      },
      {
        id: 1,
        number: 5,
        start_date: new Date('2021-10-07T00:55:35'),
        end_date: new Date('2021-10-30T20:57:00.000000Z'),
        circle_id: 1,
        created_at: new Date('2021-10-01T00:55:35.000000Z'),
        updated_at: new Date('2021-10-07T00:55:35.000000Z'),
        ended: false,
        notified_start: null,
        notified_before_end: null,
        notified_end: null,
        grant: 0.0,
        regift_days: 1,
        days: 4,
        repeat: 2,
        repeat_day_of_month: 7,
        repeatEnum: 'monthly',
        started: true,
        startDate: new Date('2021-10-01T00:55:35.000Z'),
        startDay: 'Thu',
        endDate: new Date('2021-10-30T20:57:00.000Z'),
        endDay: 'Thu',
        interval: {
          s: new Date('2021-10-01T00:55:35.000Z'),
          e: new Date('2021-10-30T20:57:00.000Z'),
        },
        invalid: null,
        isLuxonInterval: true,
        totalTokens: 5000,
        uniqueUsers: 0,
        activeUsers: 0,
        calculatedDays: 20,
        labelGraph: 'This Epoch Oct 1 - 30',
        labelDayRange: 'Oct 1 to Oct 30',
        labelTimeStart: 'Started 12:55AM UTC',
        labelTimeEnd: 'Ends 12:55AM UTC',
        labelActivity: '',
        labelUntilStart: 'The Past',
        labelUntilEnd: '8 Days',
        labelYearEnd: '2021',
      },
    ],
    [epochsReverse]
  );

  // const epochs = useMemo(() => [...epochsReverse].reverse(), [epochsReverse]);

  const renderActions = (onEdit: () => void, onDelete?: () => void) => (
    <div className={classes.tableActions}>
      {onEdit ? (
        <Button
          className={classes.allocateBtn}
          variant="contained"
          color="primary"
          size="small"
          onClick={onEdit}
        >
          Allocate Funds
        </Button>
      ) : undefined}

      {onDelete ? (
        <IconButton
          onClick={onDelete}
          className={classes.errorColor}
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      ) : undefined}
    </div>
  );

  // Epoch Columns
  const RenderEpochDetails = (e: IEpoch) => (
    <div className={classes.twoLineCell}>
      <span className={classes.twoLineCellTitle}>Epoch {e.number}</span>
      <span className={classes.twoLineCellSubtitle}>{epochDetail(e)}</span>
    </div>
  );

  const RenderEpochDates = (e: IEpoch) => (
    <div className={classes.twoLineCell}>
      <span className={classes.twoLineCellTitle}>
        {e.labelYearEnd} - {e.labelDayRange}
      </span>
      <span className={classes.twoLineCellSubtitle}>
        {e.ended ? e.labelTimeEnd : e.labelTimeStart}
      </span>
    </div>
  );

  const RenderRecentEpochActions = (e: IEpoch) =>
    e.ended ? (
      <Button variant="contained" color="primary" size="small">
        Allocate Funds
      </Button>
    ) : e.totalTokens > 0 ? (
      <Button variant="contained" className={classes.valueBtn} size="small">
        {e.totalTokens} <p className={classes.smallP}>usdc</p>
      </Button>
    ) : (
      renderActions(
        () => setEditEpoch(e),
        !e.started ? () => deleteEpoch(e.id) : undefined
      )
    );

  const epochColumns = useMemo(
    () =>
      [
        {
          label: 'Circle:Epoch',
          render: RenderEpochDetails,
          leftAlign: true,
        },
        {
          label: 'Details',
          render: RenderEpochDates,
          leftAlign: true,
        },
        {
          label: 'Allowances',
          render: RenderRecentEpochActions,
          narrow: true,
        },
      ] as ITableColumn[],
    []
  );
  const { selectedMyUser, hasAdminView } = useMe();
  const navButtonsVisible = !!selectedMyUser || hasAdminView;
  const navItems = getAdminNavigation({
    asCircleAdmin: selectedMyUser && selectedMyUser.role !== 0,
    asVouchingEnabled: selectedCircle && selectedCircle.vouching !== 0,
  });
  return (
    <div className={classes.root}>
      <div className={classes.topMenu}>
        <div className={classes.organizationLinks}>
          <Avatar
            alt="organization"
            src="/imgs/avatar/placeholder.jpg"
            style={{
              width: 46,
              height: 46,
              borderRadius: '50%',
              border: '1px solid rgba(94, 111, 116, 0.7)',
              marginRight: '16px',
            }}
          />
          <h2 className={classes.title}>Yearn Finance</h2>
          <Button
            aria-describedby="1"
            className={classes.moreButton}
            onClick={() => setEditCircle(true)}
          >
            <DownArrow />
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => setNewUser(true)}
            style={{
              marginLeft: '27px',
            }}
          >
            Create a Vault
          </Button>
        </div>
        <div className={classes.navLinks}>
          {navButtonsVisible &&
            navItems.map(navItem => (
              <NavLink
                className={classes.navLink}
                isActive={(nothing, location) =>
                  checkActive(location.pathname, navItem)
                }
                key={navItem.path}
                to={navItem.path}
              >
                {navItem.label}
              </NavLink>
            ))}
        </div>
      </div>
      <div className={classes.noVaults}>
        <div className={classes.noVaultsInterior}>
          <h2 className={classes.noVaultsTitle}>You dont have any vaults</h2>
          <h3 className={classes.noVaultsSubtitle}>To get started</h3>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => setNewUser(true)}
          >
            Create a Vault
          </Button>
          <AdminUserModal
            onClose={() =>
              newUser ? setNewUser(false) : setEditUser(undefined)
            }
            user={editUser}
            open={!!editUser || newUser}
          />
        </div>
      </div>
      <div className={classes.withVaults}>
        <div>
          <div className={classes.horizontalDisplay}>
            <h2 className={classes.vaultsTitle}>USDC Vault</h2>
            <Button variant="text" className={classes.vaultsSecondary}>
              Deposit
            </Button>{' '}
            <h4 className={classes.vaultsSecondary}> | </h4>{' '}
            <Button variant="text" className={classes.vaultsSecondary}>
              {' '}
              &nbsp;Withdaw
            </Button>
          </div>
          <h4 className={classes.noVaultsSubtitle}>
            Upcoming and Recent Epochs <InfoIcon className={classes.infoIcon} />
          </h4>
        </div>
        <div>
          <div className={classes.totalValue}>
            <h2 className={classes.number}>0</h2>
            <h2 className={classes.noVaultsTitle}>USDC ...</h2>
          </div>
          <h4 className={classes.noVaultsSubtitle}>
            Recent Transactions <InfoIcon className={classes.infoIcon} />{' '}
          </h4>
        </div>
        <StaticTableNew
          label="Testing"
          className={classes.newTable}
          columns={epochColumns}
          data={epochs}
          perPage={6}
          placeholder={
            <>
              <h2 className={classes.tablePlaceholderTitle}>
                You don’t have any recent epochs
              </h2>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<PlusCircleIcon />}
                onClick={() => setNewEpoch(true)}
              >
                Add Epoch
              </Button>
            </>
          }
        />
        <div className={classes.noVaultsInterior}>
          <h2 className={classes.noVaultsTitle}>
            There are no transactions to show yet.
          </h2>
          <h3 className={classes.noVaultsSubtitle}>
            To get started, fund your vault with USDC
          </h3>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => setNewUser(true)}
          >
            Fund This Vault
          </Button>
          <AdminUserModal
            onClose={() =>
              newUser ? setNewUser(false) : setEditUser(undefined)
            }
            user={editUser}
            open={!!editUser || newUser}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPage1;
