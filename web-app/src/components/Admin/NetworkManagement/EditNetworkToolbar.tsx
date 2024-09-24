import { Button } from "@mui/material";
import { GridRowModesModel, GridRowsProp, GridToolbarContainer } from "@mui/x-data-grid";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SettingsIcon from '@mui/icons-material/Settings';

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
}

export default function EditNetworkToolbar(props: EditToolbarProps) {
    const { setOpenSettingModal }: any = props;

    const handleSettingsClick = () => {
        setOpenSettingModal(true)
    };

    return (
        <GridToolbarContainer>
            <Button color="info" startIcon={<SettingsIcon />} onClick={handleSettingsClick}>
                Settings
            </Button>
        </GridToolbarContainer>
    );
}