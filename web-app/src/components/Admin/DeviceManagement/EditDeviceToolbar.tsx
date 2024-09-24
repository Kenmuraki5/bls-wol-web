import { Button } from "@mui/material";
import { GridRowModesModel, GridRowsProp, GridToolbarContainer } from "@mui/x-data-grid";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SettingsIcon from '@mui/icons-material/Settings';
import { handleWakeMoreDevice } from '@/lib/wake';

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
}

export default function EditDeviceToolbar(props: EditToolbarProps) {
    const { selected, setOpenSettingModal }: any = props;
    const handleWakeUpClick = async () => {
        try {
            await handleWakeMoreDevice({ "ids": selected });
        } catch (error) {
            console.error('Error in handleSubmit:', error);
        }
    };

    const handleSettingsClick = () => {
        setOpenSettingModal(true)
    };

    return (
        <GridToolbarContainer>
            <Button color="info" startIcon={<PowerSettingsNewIcon />} onClick={handleWakeUpClick}>
                Wake Up Now
            </Button>
            <Button color="info" startIcon={<SettingsIcon />} onClick={handleSettingsClick}>
                Settings
            </Button>
        </GridToolbarContainer>
    );
}