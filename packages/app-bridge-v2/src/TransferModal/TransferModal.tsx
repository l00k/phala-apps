import {KIND as ButtonKind} from 'baseui/button'
import {
  Modal,
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalHeader,
  ROLE,
  SIZE,
} from 'baseui/modal'
import {FC} from 'react'
import {TransactionInfo} from '../types'

interface TransferModalProps {
  type?: string
  isOpen: boolean
  onClose: () => void
  transactionInfo?: TransactionInfo
}

export const TransferModal: FC<TransferModalProps> = (props) => {
  const {isOpen, onClose} = props

  return (
    <Modal
      onClose={onClose}
      closeable
      isOpen={isOpen}
      animate
      autoFocus
      size={SIZE.default}
      role={ROLE.dialog}
    >
      <ModalHeader>Bridge Confirmation</ModalHeader>
      <ModalBody>Proin ut dui sed metus pharet</ModalBody>
      <ModalFooter>
        <ModalButton kind={ButtonKind.tertiary}>Cancel</ModalButton>
        <ModalButton>Submit</ModalButton>
      </ModalFooter>
    </Modal>
  )
}
