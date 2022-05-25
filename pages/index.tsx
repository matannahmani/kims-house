import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import { DataGrid, GridColumns, GridRowsProp } from '@mui/x-data-grid';
import { Box } from '@mui/system';
import {
  Button,
  Drawer,
  Fab,
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQuery } from 'react-query';
import Reservation from '../models/reservation';
import request, { gql } from 'graphql-request';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LoadingButton } from '@mui/lab';
import { Close } from '@mui/icons-material';

const columns: GridColumns = [
  { field: 'name', headerName: 'Name', width: 140 },
  { field: 'room', headerName: 'Room', type: 'string', width: 140 },
  { field: 'phone', headerName: 'Phone', type: 'string', width: 200 },
  { field: 'email', headerName: 'Email', type: 'string', width: 200 },
  { field: 'payment', headerName: 'Is Paid', type: 'boolean' },
  { field: 'checkIn', headerName: 'Check In', type: 'date' },
  { field: 'checkOut', headerName: 'Check Out', type: 'date' },
  // {
  //   field: 'checkIn',
  //   headerName: 'Residence Status',
  //   type: 'date',
  //   width: 180,
  //   renderCell: (params) => {
  //     return (
  //       <Box>
  //         <Box>{new Date(params.value).toISOString()}</Box>
  //       </Box>
  //     );
  //   },
  //   editable: false,
  // },
  // {
  //   field: 'lastLogin',
  //   headerName: 'Payment Status',
  //   type: 'dateTime',
  //   width: 220,
  //   editable: true,
  // },
];

const rows: GridRowsProp = [
  {
    id: 1,
    name: 'bob',
    phone: '010-3287-0111',
    email: 'bob@marley.com',
    dateCreated: new Date(),
    lastLogin: new Date(),
  },
  {
    id: 2,
    name: 'bob',
    phone: '010-3287-0111',
    email: 'bob@marley.com',
    dateCreated: new Date(),
    lastLogin: new Date(),
  },
  {
    id: 3,
    name: 'bob',
    phone: '010-3287-0111',
    email: 'bob@marley.com',
    dateCreated: new Date(),
    lastLogin: new Date(),
  },
  {
    id: 4,
    name: 'bob',
    phone: '010-3287-0111',
    email: 'bob@marley.com',
    dateCreated: new Date(),
    lastLogin: new Date(),
  },
  {
    id: 5,
    name: 'bob',
    phone: '010-3287-0111',
    email: 'bob@marley.com',
    dateCreated: new Date(),
    lastLogin: new Date(),
  },
];

const Home: NextPage = () => {
  const [drawerOpen, setDrawer] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [reservation, setReservation] = useState({
    name: '',
    phone: '',
    email: '',
    checkIn: new Date(),
    checkOut: new Date(),
    payment: false,
    room: '',
    _id: '',
  });
  const { data, isLoading, refetch } = useQuery<Reservation[]>(
    'reservations',
    async () => {
      const data = await request(
        `/api/graphql`,
        gql`
          query ReservationMany {
            reservationMany {
              name
              checkIn
              checkOut
              room
              payment
              email
              phone
              _id
            }
          }
        `
      );
      return data.reservationMany;
    }
  );

  const mutation = useMutation(
    async (res: {
      name: string;
      phone: string;
      email: string;
      checkIn: Date;
      checkOut: Date;
      payment: boolean;
      room: string;
      _id?: string;
    }) => {
      const cleanedRes = { ...res };
      delete cleanedRes._id;
      if (isEditing) {
        const data = await request(
          `/api/graphql`,
          gql`
            mutation ReservationUpdateById(
              $id: MongoID!
              $record: UpdateByIdReservationInput!
            ) {
              reservationUpdateById(_id: $id, record: $record) {
                recordId
              }
            }
          `,
          {
            id: res._id,
            record: cleanedRes,
          }
        );
      } else {
        const data = await request(
          `/api/graphql`,
          gql`
            mutation ReservationCreateOne($record: CreateOneReservationInput!) {
              reservationCreateOne(record: $record) {
                recordId
              }
            }
          `,
          {
            record: cleanedRes,
          }
        );
      }
    },
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  const saveDrawer = () => {
    mutation.mutate(reservation);
  };

  const closeDrawer = () => {
    setDrawer(false);
    setEditing(false);
  };

  return (
    <>
      <Container
        sx={{
          minHeight: '100vh',
          display: 'flex',

          alignItems: {
            xs: 'center',
            md: 'flex-start',
          },
          justifyContent: 'center',
        }}
        maxWidth="lg"
      >
        <Stack
          mt={{
            xs: 0,
            md: 6,
          }}
          width="80%"
          height="100%"
          spacing={6}
        >
          <Typography variant="h4">Upcoming Reservations</Typography>
          <Box>
            <DataGrid
              onRowClick={(params, e) => {
                console.log(params.row);
                setReservation(params.row);
                setDrawer(true);
                setEditing(true);
              }}
              sx={{ minHeight: 640, height: '100%' }}
              rows={data || []}
              getRowId={(row) => row._id}
              loading={isLoading}
              columns={columns}
              experimentalFeatures={{ newEditingApi: true }}
            />
          </Box>
        </Stack>
      </Container>
      <Drawer anchor="left" open={drawerOpen} onClose={closeDrawer}>
        <Stack
          sx={{
            height: '100%',
            width: {
              xs: '100vw',
              sm: '280px',
            },
            p: 2,
          }}
          spacing={2}
        >
          <Box
            display="flex"
            sx={{
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">
              {isEditing ? 'Update' : 'Add'} Reservation
            </Typography>
            <IconButton
              sx={{
                ml: 'auto',
              }}
              onClick={closeDrawer}
            >
              <Close />
            </IconButton>
          </Box>
          <TextField
            label="Name"
            value={reservation.name}
            onChange={(e) =>
              setReservation((res) => ({ ...res, name: e.target.value }))
            }
          />
          <TextField
            label="Room"
            value={reservation.room}
            onChange={(e) =>
              setReservation((res) => ({ ...res, room: e.target.value }))
            }
          />
          <TextField
            label="Phone"
            value={reservation.phone}
            onChange={(e) =>
              setReservation((res) => ({ ...res, phone: e.target.value }))
            }
          />
          <TextField
            label="Email"
            value={reservation.email}
            onChange={(e) =>
              setReservation((res) => ({ ...res, email: e.target.value }))
            }
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Check In"
              value={reservation.checkIn}
              onChange={(newValue) => {
                if (newValue)
                  setReservation((res) => ({ ...res, checkIn: newValue }));
              }}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="Check Out"
              value={reservation.checkOut}
              onChange={(newValue) => {
                if (newValue)
                  setReservation((res) => ({ ...res, checkOut: newValue }));
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={reservation.payment}
                  onChange={(e) =>
                    setReservation((res) => ({
                      ...res,
                      payment: e.target.checked,
                    }))
                  }
                />
              }
              sx={{ m: '0 auto' }}
              labelPlacement="start"
              label="Reservation Paid"
            />
          </FormGroup>
          <LoadingButton
            onClick={saveDrawer}
            loading={mutation.isLoading}
            sx={{ marginTop: 'auto!important', mb: '24px!important' }}
            variant="contained"
          >
            {isEditing ? 'Update' : 'Add'} Reservation
          </LoadingButton>
        </Stack>
      </Drawer>
      <Fab
        onClick={() => setDrawer(true)}
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        color="secondary"
        aria-label="add"
      >
        <AddIcon />
      </Fab>
    </>
  );
};

export default Home;
