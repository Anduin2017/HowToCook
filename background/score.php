<?php
/*
 * 你可能会认为你读得懂以下的代码。但是你不会懂的，相信我吧。
 * 要是你尝试玩弄这段代码的话，你将会在无尽的通宵中不断地咒骂自己为什么会认为自己聪明到可以优化这段代码。
 * 现在请关闭这个文件去玩点别的吧!


 * ░░░░░░░░░░░░░░░░░░░░░░░░▄░░
 * ░░░░░░░░░▐█░░░░░░░░░░░▄▀▒▌░
 * ░░░░░░░░▐▀▒█░░░░░░░░▄▀▒▒▒▐
 * ░░░░░░░▐▄▀▒▒▀▀▀▀▄▄▄▀▒▒▒▒▒▐
 * ░░░░░▄▄▀▒░▒▒▒▒▒▒▒▒▒█▒▒▄█▒▐
 * ░░░▄▀▒▒▒░░░▒▒▒░░░▒▒▒▀██▀▒▌
 * ░░▐▒▒▒▄▄▒▒▒▒░░░▒▒▒▒▒▒▒▀▄▒▒
 * ░░▌░░▌█▀▒▒▒▒▒▄▀█▄▒▒▒▒▒▒▒█▒▐
 * ░▐░░░▒▒▒▒▒▒▒▒▌██▀▒▒░░░▒▒▒▀▄
 * ░▌░▒▄██▄▒▒▒▒▒▒▒▒▒░░░░░░▒▒▒▒
 * ▀▒▀▐▄█▄█▌▄░▀▒▒░░░░░░░░░░▒▒▒
 * 单身狗就这样默默地看着你，一句话也不说
 */
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
$name = $_GET["cname"];
$score = $_GET["score"];
if($score != "good" && $score != "bad"){
echo "[\"code=1\",\"return=error\",\"errormsg=Illegal entry\"]";
exit;
}
else{
if($score == "good){
  if(!file_exists($CounterFile)){

   $counter = 0; 

   $cf = fopen($CounterFile,"w");

   fputs($cf,'0');

   fclose($cf);

  }

  else{

   $cf = fopen($CounterFile,"r");

   $counter = trim(fgets($cf,$max_len));

   fclose($cf);

  }

  $counter++;

  $cf = fopen($CounterFile,"w");//覆盖写新数据

  fputs($cf,$counter);

  fclose($cf);
} else{
  if(!file_exists($CounterFile)){

   $counter = 0; 

   $cf = fopen($CounterFile,"w");

   fputs($cf,'0');

   fclose($cf);

  }

  else{

   $cf = fopen($CounterFile,"r");

   $counter = trim(fgets($cf,$max_len));

   fclose($cf);

  }

  $counter = counter - 1;

  $cf = fopen($CounterFile,"w");

  fputs($cf,$counter);

  fclose($cf);
}
echo "现在的评分是:".$counter;
