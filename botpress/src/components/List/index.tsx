import React from 'react';
import {
  List as BaseList,
  ListItem,
  Box,
  Typography,
  ListDivider,
  IconButton,
  ListSubheader,
} from '@mui/joy';
import { SxProps } from '@mui/system';
import Delete from '@mui/icons-material/Delete';

export const List = (props: {
  title: string;
  items: { id: number; value: string }[];
  sx?: SxProps;
  onDelete?: (id: number) => void;
}) => {
  return (
    <Box sx={props.sx} width="100%">
      <BaseList sx={{ p: 0 }}>
        <ListItem>
          <ListSubheader sticky sx={{ m: 'auto', p: 0 }}>
            <Typography level="h6" fontWeight="sm" textTransform="uppercase" className="font-bold">
              {props.title}
            </Typography>
          </ListSubheader>
        </ListItem>
        <ListDivider inset="context" sx={{ m: 0 }} />
        <ListItem>
          <BaseList aria-label="basic-list">
            {props.items.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem
                  endAction={
                    <IconButton aria-label="Delete" size="sm" color="danger">
                      <Delete onClick={() => props.onDelete?.(item.id)} />
                    </IconButton>
                  }
                >
                  {item.value}
                </ListItem>
                <ListDivider inset="gutter" />
              </React.Fragment>
            ))}
          </BaseList>
        </ListItem>
      </BaseList>
    </Box>
  );
};
