import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#171717',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 20,
    },
  
    text: {
      backgroundColor: "#323333",
      color: "white",
      height: 50,
      fontSize: 35,
      fontStyle: "italic",
      marginTop: 50,
    },
  
    image: {
      width: 200,
      height: 200,
      marginTop: 10,
    },
  
    button: {
      alignItems: 'center',
      backgroundColor: '#DDDDDD',
      padding: 10,
      margin: 10,
      borderRadius: 5,
      width: 200,
    },
    buttonText: {
      color: '#FFFFFF',
    },
    predictionsContainer: {
      marginTop: 20,
      alignItems: "center",
    },
    predictionsHeader: {
      color: "black",
      backgroundColor:"lightblue",
      opacity : 1,
      width : 110,
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 40,
    },
    predictionText: {
      color: "white",
      fontSize: 6,
      marginBottom: 10,
      flexDirection: "row", 
      alignItems: "center", 
    },
    scoretext : {
      color : "white",
      marginLeft : 20,
    },
    
    
    healthBar: {
      height: 10,             
      backgroundColor: "green", 
    },

  });
  
  
  
  
  