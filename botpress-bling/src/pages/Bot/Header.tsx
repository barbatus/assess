import { memo, useCallback, useState } from 'react';
import {
  Box,
  Select,
  Option,
  IconButton,
  Button,
  Modal,
  ModalClose,
  Input,
  ModalDialog,
} from '@mui/joy';
import { Add as AddIcon } from '@mui/icons-material';

const AddVersionModal = memo(
  (props: { open: boolean; onClose: () => void; onAdd: (v: string) => void }) => {
    const [verison, setVersion] = useState('');

    const onAdd = useCallback(() => {
      props.onAdd(verison);
      setVersion('');
    }, [verison, props.onAdd]);

    return (
      <Modal
        open={props.open}
        onClose={props.onClose}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <ModalDialog
          variant="soft"
          layout="center"
          sx={{ maxWidth: 500, borderRadius: 'md', boxShadow: 'lg', p: 3 }}
        >
          <ModalClose size="sm" sx={{ position: 'absolute', top: 0, right: 0 }} />
          <Box>
            <Input
              value={verison}
              onChange={(e) => setVersion(e.target.value)}
              fullWidth
              endDecorator={
                <Button variant="soft" color="neutral" onClick={onAdd}>
                  Add
                </Button>
              }
            />
          </Box>
        </ModalDialog>
      </Modal>
    );
  },
);

export const Header = memo(
  (props: { versions: string[]; onTest: (v: string) => void }) => {
    const [open, setOpen] = useState(false);
    const [verisons, setVersions] = useState(props.versions);
    const [value, setVersion] = useState(props.versions[0]);
    const onAdd = useCallback((v: string) => {
      setVersions((verisons) => [...verisons, v]);
      setOpen(false);
    }, []);

    return (
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        sx={{ pr: 4, height: '100%' }}
      >
        <Select
          value={value}
          size="sm"
          sx={{ mr: 4, width: 180 }}
          indicator={null}
          endDecorator={
            <IconButton
              size="sm"
              variant="plain"
              color="neutral"
              onClick={() => setOpen(true)}
            >
              <AddIcon />
            </IconButton>
          }
        >
          {verisons.map((v) => (
            <Option key={v} value={v} onClick={() => setVersion(v)}>
              {v}
            </Option>
          ))}
        </Select>
        <Button size="sm" variant="soft" onClick={() => props.onTest(value)}>
          Test
        </Button>
        <AddVersionModal open={open} onAdd={onAdd} onClose={() => setOpen(false)} />
      </Box>
    );
  },
);
