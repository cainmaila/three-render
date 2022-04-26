import Radio from '@mui/material/Radio';
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box/Box';

export default function RowRadioButtonsGroup() {
  const radioGroup = useRadioGroup();
  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        padding: 1,
        color: '#fff',
      }}
    >
      <FormControl>
        <FormLabel
          id="demo-row-radio-buttons-group-label"
          style={{
            color: '#fff',
          }}
        >
          渲染流量
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          defaultValue="middle"
        >
          <FormControlLabel
            value="low"
            control={
              <Radio
                style={{
                  color: '#fff',
                }}
              />
            }
            label="低"
          />
          <FormControlLabel
            value="middle"
            control={
              <Radio
                style={{
                  color: '#fff',
                }}
              />
            }
            label="中"
          />
          <FormControlLabel
            value="hight"
            control={
              <Radio
                style={{
                  color: '#fff',
                }}
              />
            }
            label="高"
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );
}
