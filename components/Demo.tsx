import { Modal } from "flowbite-react";


export default function Demo(show: boolean, onClose: () => void) {
  return (
    <Modal
      show={show}
      size="6xl"
      onClose={onClose}
    >
      <Modal.Header>
        
      </Modal.Header>
    </Modal>
  );
}