import React, { useState } from 'react';
import axios from 'axios';
// import { useTheme } from '@mui/material/styles';
import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextareaAutosize,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { AppBar, Toolbar, CssBaseline} from '@mui/material';
import Stack from '@mui/material/Stack';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import './App.css';

function App() {
    const [darkMode, setDarkMode] = useState(true);
    const [question, setQuestion] = useState('');
    const [solution, setSolution] = useState('');
    const [fullMarks, setFullMarks] = useState('');
    const [obtainedMarks, setObtainedMarks] = useState('');
    const [justification, setJustification] = useState('');
    const [llm, setLlm] = useState('Select LLM');
    const [apiKey, setApiKey] = useState('');
    const [questionImage, setQuestionImage] = useState(null);
    const [solutionImage, setSolutionImage] = useState(null);
    const [rubricRows, setRubricRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    const lightTheme = createTheme({
        palette: {
          mode: 'light',
          // Define other theme properties for the light theme if needed
        },
        // other theme configurations
      });
      
      // Dark theme configuration
    const darkTheme = createTheme({
        palette: {
          mode: 'dark',
          // Define other theme properties for the dark theme if needed
        },
        // other theme configurations
      });
  
    const toggleMode = () => setDarkMode(!darkMode);
    // const theme = useTheme();
    const handleQuestionImageUpload = (event) => {
      setQuestionImage(URL.createObjectURL(event.target.files[0]));
    };
  
    const handleSolutionImageUpload = (event) => {
      setSolutionImage(URL.createObjectURL(event.target.files[0]));
    };

    // Handlers for ImageUpload component
    const handleQuestionImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
        setQuestionImage(URL.createObjectURL(event.target.files[0]));
        }
    };

    const handleSolutionImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
        setSolutionImage(URL.createObjectURL(event.target.files[0]));
        }
    };
  
    const removeQuestionImage = () => setQuestionImage(null);
    const removeSolutionImage = () => setSolutionImage(null);
  
    const addRubricRow = () => {
      setRubricRows([...rubricRows, { criterion: '', marks: '' }]);
    };
  
    const removeRubricRow = (index) => {
      const newRows = [...rubricRows];
      newRows.splice(index, 1);
      setRubricRows(newRows);
    };
  
    const handleRubricChange = (index, field, value) => {
      const newRows = [...rubricRows];
      newRows[index][field] = value;
      setRubricRows(newRows);
    };
  
    const evaluateTextPrompt = async () => {
        try {
          setIsLoading(true); // Start loading
      
          // Formatting the rubrics table as a string
          const rubricsTableString = rubricRows.map(row => `| ${row.criterion} | ${row.marks} |`).join('\n');
          
          // Construct the data to be sent
          const dataToSend = {
            total: fullMarks,
            question: question,
            solution: solution,
            rubrics: rubricsTableString
            };
            
            // alert(dataToSend.total)
            // alert(dataToSend.question)
            // alert(dataToSend.solution)
            // alert(dataToSend.rubrics)

          const response = await axios.post('http://127.0.0.1:7777/process', dataToSend);
      
          if (response.status === 200) {
            setJustification(response.data.response);
          } else {
            alert('Failed to get response from server.');
          }
        } catch (error) {
          alert(`An error occurred: ${error.message}`);
        } finally {
          setIsLoading(false); // Stop loading
        }
      };
      
    // Helper function to make POST request to the server
    const postQuestion = async (questionText) => {
        try {
        const response = await axios.post('http://127.0.0.1:7777/process', { text: questionText });
        if (response.status === 200) {
            setJustification(response.data.response);
        } else {
            alert('Failed to get response from server.');
        }
        } catch (error) {
        alert(`An error occurred: ${error.message}`);
        }
    };

    // Function to handle Evaluate button click
    const handleEvaluate = () => {
        // Use the OCR result or the text depending on what's available
        const textToEvaluate = questionImage ? 'OCR result of the image' : question; // Replace with actual OCR logic
        postQuestion(textToEvaluate);
    };

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    GOAL Optimax
                </Typography>
                {/* If you have a toggle dark mode button, you can place it here */}
                </Toolbar>
            </AppBar>
        <Container>
          <Paper elevation={darkMode ? 0 : 3} sx={{ margin: '16px', padding: '16px' }}>
            <Grid container spacing={3}>
              {/* Left Column for input */}
              <Grid item xs={12} md={6}>
                <IconButton onClick={toggleMode} sx={{ marginBottom: '16px' }}>
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>

                <Typography variant="h5" gutterBottom>Questions & Answers</Typography>
                <TextField
                  label="Question"
                  variant="outlined"
                  fullWidth
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  multiline
                  rows={4}
                  sx={{ display: questionImage ? 'none' : 'block', my: 2 }}
                />
                {!questionImage && (
                  <Button variant="contained" component="label" startIcon={<UploadIcon />}>
                    Upload Question Image
                    <input type="file" hidden onChange={handleQuestionImageUpload} />
                  </Button>
                )}
    
                <Stack direction="column" alignItems="center" spacing={2}>
                {questionImage && (
                    <>
                    <img src={questionImage} alt="Question" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                    <Button 
                        variant="contained" 
                        startIcon={<DeleteIcon />} 
                        onClick={removeQuestionImage}
                    >
                        Remove Question Image
                    </Button>
                    </>
                )}
                </Stack>
    
                <TextField
                  label="Solution"
                  variant="outlined"
                  fullWidth
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  multiline
                  rows={4}
                  sx={{ display: solutionImage ? 'none' : 'block', my: 2 }}
                />
                            
                {!solutionImage && (
                  <Button variant="contained" component="label" startIcon={<UploadIcon />}>
                    Upload Solution Image
                    <input type="file" hidden onChange={handleSolutionImageUpload} />
                  </Button>
                )}

                <Stack direction="column" alignItems="center" spacing={2}>
                {solutionImage && (
                    <>
                    <img src={solutionImage} alt="Solution" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                    <Button 
                        variant="contained" 
                        startIcon={<DeleteIcon />} 
                        onClick={removeSolutionImage}
                    >
                        Remove Solution Image
                    </Button>
                    </>
                )}
                </Stack>
    
                <FormControl fullWidth sx={{ my: 2 }}>
                  <InputLabel id="llm-label">Select LLM</InputLabel>
                  <Select
                    labelId="llm-label"
                    value={llm}
                    label="Select LLM"
                    onChange={(e) => setLlm(e.target.value)}
                  >
                    <MenuItem value="Select LLM">Select LLM</MenuItem>
                    <MenuItem value="Zephyr 7B β">Zephyr 7B β</MenuItem>
                    <MenuItem value="Llama-2">Llama-2 7B</MenuItem>
                    <MenuItem value="gpt-3.5-turbo">gpt-3.5-turbo</MenuItem>
                    <MenuItem value="gpt-4">gpt-4</MenuItem>
                  </Select>
                </FormControl>
    
                {(llm === 'gpt-3.5-turbo' || llm === 'gpt-4') && (
                  <TextField
                    label="API Key"
                    variant="outlined"
                    fullWidth
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                )}
    
                <TextField
                  label="Full Marks"
                  variant="outlined"
                  fullWidth
                  value={fullMarks}
                  onChange={(e) => setFullMarks(e.target.value)}
                  type="number"
                  sx={{ mb: 2 }}
                />
    
                {/* Rubric Table */}
                <Typography variant="h5" gutterBottom>Rubric</Typography>
                <List>
                  {rubricRows.map((row, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton edge="end" onClick={() => removeRubricRow(index)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={
                          <TextField
                            label="Criterion"
                            variant="outlined"
                            fullWidth
                            value={row.criterion}
                            onChange={(e) => handleRubricChange(index, 'criterion', e.target.value)}
                          />
                        }
                      />
                      <ListItemText
                        primary={
                          <TextField
                            label="Marks"
                            variant="outlined"
                            fullWidth
                            value={row.marks}
                            onChange={(e) => handleRubricChange(index, 'marks', e.target.value)}
                            type="number"
                          />
                        }
                      />
                    </ListItem>
                  ))}
                </List>
    
                <Button variant="contained" onClick={addRubricRow} sx={{ mb: 2 }}>
                  Add Rubric Row
                </Button>
    
                <Button variant="contained" color="primary" onClick={evaluateTextPrompt} fullWidth>
                  Evaluate
                </Button>
              </Grid>
    
              {/* Right Column for output */}
                <Grid item xs={12} md={6}>
                {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10%' }}>
                    <CircularProgress />
                </div>
                )}
              <Typography variant="h6" gutterBottom>Obtained Marks</Typography>
                <Paper variant="outlined" sx={{ padding: '16px', backgroundColor: 'background.paper', mb: 2 }}>
                  {obtainedMarks || "Not available"}
                </Paper>
                <Typography variant="h6" gutterBottom>Justification for the Marks</Typography>
                <Paper variant="outlined" sx={{ padding: '16px', backgroundColor: 'background.paper', mb: 2 }}>
                <TextareaAutosize
                    minRows={10}
                    value={justification}
                    readOnly
                    style={{ 
                        width: '100%', 
                        border: 'none', 
                        resize: 'none',
                        backgroundColor: darkMode ? '#121212' : '#FFF', // Black for dark mode, White for light mode
                        color: darkMode ? '#FFF' : '#000', // White text for dark mode, Black text for light mode
                    }}
                    />

                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Container>
    </ThemeProvider>
      );
    }
    
    export default App;