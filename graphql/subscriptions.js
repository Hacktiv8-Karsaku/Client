import { gql } from '@apollo/client';

export const CONSULTATION_READY = gql`
  subscription ConsultationReady($patientId: ID!) {
    consultationReady(patientId: $patientId) {
      roomId
      doctorId
      patientId
      status
    }
  }
`;

export const WAITING_ROOM_SUBSCRIPTION = gql`
  subscription WaitingRoomUpdated($doctorId: ID!) {
    waitingRoomUpdated(doctorId: $doctorId) {
      patients {
        userId
        username
        waitingSince
        consultationType
      }
      estimatedWaitTime
    }
  }
`; 