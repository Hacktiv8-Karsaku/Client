import { gql } from '@apollo/client';

export const JOIN_WAITING_ROOM = gql`
  mutation JoinWaitingRoom($consultationType: String!, $doctorId: ID!) {
    joinWaitingRoom(consultationType: $consultationType, doctorId: $doctorId) {
      userId
      username
      waitingSince
      consultationType
    }
  }
`;

export const ACCEPT_NEXT_PATIENT = gql`
  mutation AcceptNextPatient($patientId: ID!) {
    acceptNextPatient(patientId: $patientId) {
      roomId
      doctorId
      patientId
      status
    }
  }
`;