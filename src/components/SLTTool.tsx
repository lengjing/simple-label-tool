import React from 'react';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import NearMeIcon from '@mui/icons-material/NearMe';
import RouteIcon from '@mui/icons-material/Route';
import { ITool, useStore } from '../slt';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import ToggleButton from '@mui/material/ToggleButton';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import ToggleButtonGroup, {
    toggleButtonGroupClasses,
} from '@mui/material/ToggleButtonGroup';
import { Box } from '@mui/material';
import { observer } from 'mobx-react';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    [`& .${toggleButtonGroupClasses.grouped}`]: {
        margin: theme.spacing(0.5),
        border: 0,
        borderRadius: theme.shape.borderRadius,
        [`&.${toggleButtonGroupClasses.disabled}`]: {
            border: 0,
        },
    },
}));

const SLTTool = observer(() => {
    const store = useStore();

    return (
        <div>
            <Box
                sx={{
                    display: 'flex',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    flexWrap: 'wrap',
                    marginTop: 0.8
                }}
            >
                <StyledToggleButtonGroup
                    size="small"
                    value={"cube"}
                    exclusive
                //   onChange={handleAlignment}
                >
                    <ToggleButton value="selection">
                        <NearMeIcon></NearMeIcon>
                    </ToggleButton>
                    <ToggleButton value="cube">
                        <ViewInArIcon></ViewInArIcon>
                    </ToggleButton>
                    <ToggleButton value="rect">
                        <CropSquareIcon></CropSquareIcon>
                    </ToggleButton>
                    <ToggleButton value="lasso">
                        <RouteIcon></RouteIcon>
                    </ToggleButton>
                </StyledToggleButtonGroup>
                <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
                <StyledToggleButtonGroup
                    size="small"
                    exclusive
                    onChange={(e, value) => {
                        if (value === 'redo') {
                            store.redo();
                        } else if (value === 'undo') {
                            store.undo();
                        }
                    }}
                >
                    <ToggleButton value="redo" disabled={!store.canRedo}>
                        <RedoIcon />
                    </ToggleButton>
                    <ToggleButton value="undo" disabled={!store.canUndo}>
                        <UndoIcon />
                    </ToggleButton>
                </StyledToggleButtonGroup>
            </Box>
        </div>
    );
})

export default SLTTool;
