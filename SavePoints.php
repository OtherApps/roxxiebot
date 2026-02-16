<?php
header("Access-Control-Allow-Origin: *"); // Use a specific origin (e.g., 'https://yourfrontenddomain.com') for better security
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");

$servername = "localhost";
$username = "root";
$password = "james1234";
$dbname = "test";
$dbUser = null; 

$conn = new mysqli($servername, $username, $password, $dbname);


if($conn->connect_error){
include("Error.html");

}

else{

if(($_POST['id']!=null)&&($_POST['username']!=null)&&($_POST['points']!=null)&&($_POST['note']!=null))
{
	$current_date=date("F_Y");
		$tbName=$_POST['streamer']."_".$current_date."_points";
		$checkdb=table_exists($conn,$tbName);
		
		if($checkdb!=true){
				
		 createDB($conn,$tbName);
			
		}
		else{
			$mydate=getdate(date("U"));
			$formmatedDate="$mydate[month]_$mydate[mday]_$mydate[year]";
			
		//	phpinfo();
			
			SavePoints($conn,$tbName,$_POST['id'],$_POST['username'],$_POST['points'],$_POST['note'],$_POST['stickers'],$formmatedDate);
			
			
			
		}
	
}

else { 
 print_r($_POST);


}

}


die();

function updatePoints($conn,$dbuser,$YnId,$user,$Amount,$note){
	
	
	
}

function SavePoints($conn,$dbuser,$YnId,$user,$Amount,$note,$stick,$WhenDate){

/*	
default statement

$sqlstatement ="INSERT INTO ".$dbuser." (YnId,user,points,notes,stickers,DateSaved)
VALUES ('".$YnId."','".$user."',".$Amount.",'".$note."',".$stick.",'".$WhenDate."');";
*/

$sqlstatement ="INSERT INTO ".$dbuser." (YnId,user,points,notes,stickers,DateSaved)
VALUES ('".$YnId."','".$user."',".$Amount.",'".$note."',".$stick.",'".$WhenDate."') ON DUPLICATE KEY UPDATE stickers = '$stick',points='$Amount'";


/*
$sqlstatement ="INSERT INTO ".$dbuser." (YnId,user,points,notes,stickers,DateSaved)
VALUES ('".$YnId."','".$user."',".$Amount.",'".$note."',".$stick.",'".$WhenDate."') ON DUPLICATE KEY UPDATE stickers = '$stick', points='$amount';";


INSERT INTO users (username, email, logins)
VALUES ('jdoe', 'john@example.com', 1)
ON DUPLICATE KEY UPDATE 
    logins = logins + 1; 
*/
echo $sqlstatement;

	if($result = $conn->query($sqlstatement))
	{
			include("Head.html");	
			
			echo "<div>";
			echo 'Mooo:) Results have been saved! <br>';	
			echo "<a href='AddPoints.php'>Add more starts</a>";
			echo "</div>";
			
			include("footer.html");
	}
	else{
		//echo ($conn->error);
		echo $conn->error;
		echo " Something went wrong!<b>Baaah</b>";
	}
	
}


function table_exists($db, $table)
{
	$result = $db->query("SHOW TABLES LIKE '{$table}'");
	if( $result->num_rows == 1 )
	{
	        return TRUE;
	}
	else
	{
			
	        return FALSE;
	}
	$result->free();
}



function createDB($conn,$dbUser){

$sql = "CREATE TABLE ".$dbUser."(
        id INT(2) PRIMARY KEY AUTO_INCREMENT, 
		YnId INT NOT NULL,
        user VARCHAR(30) NOT NULL UNIQUE,
		stickers INT null,
        points INT NOT NULL,
		notes VARCHAR(200) NOT NULL,
        DateSaved VARCHAR(50) NOT NULL
        )";
echo $sql;

if ($conn->query($sql) === TRUE) {
	
    echo "Point created successfully";
} else {
    echo "Error creating table: " . $conn->error;
	
}
$conn->close();


}


?>
