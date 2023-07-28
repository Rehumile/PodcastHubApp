import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import Button from '@mui/material/Button';
import { Container } from "@mui/material";

// eslint-disable-next-line react/prop-types
export default function GoBack({onGoBack}) {

   
    return (
        <>
         <Container>
        <Button 
        variant="contained" 
        size="large" 
        color="secondary" 
        startIcon={<ArrowBackIosOutlinedIcon/>} 
        onClick={onGoBack}
        sx={{mt:'6rem'}}
        >
            Back
        </Button>
</Container> 

        </>
    )
}