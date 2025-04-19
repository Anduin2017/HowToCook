@echo off
chcp 65001 > nul

title HowToCook 项目贡献助手

:mainMenu
cls   REM 清屏
echo.
echo ======================================================
echo  [ HowToCook 项目贡献助手 ]
echo ======================================================
echo.
echo  请选择操作:
echo.
echo  [1]  创建/切换分支
echo  [2]  添加修改
echo  [3]  提交修改
echo  [4]  推送分支
echo  [5]  同步 Fork (从 Upstream 更新)
echo  [6]  设置 Upstream 仓库地址
echo  [9]  添加远程仓库
echo  [7]  删除本地分支
echo  [8]  删除远程分支
echo.
echo  [0]  退出
echo.
set /p "choice=  请选择 (0-9): "

REM 使用更简洁的 IF 语句结构
if "%choice%"=="0" goto exit
if "%choice%"=="1" goto createBranch
if "%choice%"=="2" goto addChanges
if "%choice%"=="3" goto commitChanges
if "%choice%"=="4" goto pushBranch
if "%choice%"=="5" goto pullUpstream
if "%choice%"=="6" goto setupUpstream
if "%choice%"=="9" goto addRemote
if "%choice%"=="7" goto deleteLocalBranch
if "%choice%"=="8" goto deleteRemoteBranch

echo.
echo  **错误**: 无效的选择，请重新选择.
pause
goto mainMenu

:createBranch
cls
echo.
echo ======================================================
echo  [1] 创建并切换到新分支
echo ======================================================
echo.
set /p "branchName=  请输入新分支名称: "

REM 分支名称校验（简单示例，更严格的校验可参考正则表达式）
if "%branchName%"=="" (
    echo.
    echo  **错误**: 分支名称不能为空！
    pause
    goto mainMenu
)
echo.
echo  正在创建并切换到分支 "%branchName%"...
git checkout -b "%branchName%"
if %errorlevel% neq 0 (
    echo.
    echo  **错误**: 创建分支失败，错误代码: %errorlevel%
    echo   请检查分支名称是否合法或已存在。 可以尝试使用git branch查看已存在的分支
    pause
    goto mainMenu
)
echo.
echo  已成功创建并切换到分支 "%branchName%"
pause
goto mainMenu

:addChanges
cls
echo.
echo ======================================================
echo  [2] 添加修改
echo ======================================================
echo.
echo  [a]  添加所有文件
echo  [文件名] 添加指定文件 (例如： README.md)
echo.
set /p "addType=  请输入选项 (a 或 文件名): "
if /i "%addType%"=="a" (
    echo.
    echo  正在添加所有文件...
    git add .
    if %errorlevel% neq 0 (
        echo.
        echo  **错误**: 添加所有文件失败，错误代码: %errorlevel%
        echo   请检查是否在git仓库目录下运行 或者是否有文件未保存
        pause
        goto mainMenu
    )
    echo.
    echo  已添加所有文件到暂存区。
) else (
    echo.
    echo  正在添加文件 "%addType%"...
    git add "%addType%"
    if %errorlevel% neq 0 (
        echo.
        echo  **错误**: 添加文件 "%addType%" 失败，错误代码: %errorlevel%
        echo   请检查文件名 "%addType%" 是否正确, 可以使用git status查看
        pause
        goto mainMenu
    )
    echo.
    echo  已添加文件 "%addType%" 到暂存区。
)
pause
goto mainMenu

:commitChanges
cls
echo.
echo ======================================================
echo  [3] 提交修改
echo ======================================================
echo.
set /p "commitMessage=  请输入提交信息: "

REM 创建一个临时文件来存储提交信息
echo "%commitMessage%" > temp_commit_message.txt

echo.
echo  正在提交修改...
git commit --file=temp_commit_message.txt
if %errorlevel% neq 0 (
    echo.
    echo  **错误**: 提交失败，错误代码: %errorlevel%
    echo   请检查暂存区是否为空(git status)或者是否有未解决的冲突(git status)。
    del temp_commit_message.txt  REM 删除临时文件
    pause
    goto mainMenu
)
echo.
echo  提交成功，提交信息: "%commitMessage%"
del temp_commit_message.txt  REM 删除临时文件
pause
goto mainMenu

:pushBranch
cls
echo.
echo ======================================================
echo  [4] 推送分支到 GitHub
echo ======================================================
echo.

REM  询问用户要推送到的远程仓库名称
echo   如果您的 fork 仓库 (git@github.com:424635328/HowToCook.git 或 https://github.com/424635328/HowToCook) 已设置为 origin，请直接回车。
echo   如果未设置，请输入您的 fork 仓库的远程仓库名称，或输入 "add" 添加一个新的远程仓库。
set /p "remoteName=  请输入要推送到的远程仓库名称 (默认为 origin): "
if "%remoteName%"=="" set "remoteName=origin"

if /i "%remoteName%"=="add" goto addRemote

set /p "pushBranch=  请输入要推送的分支名称: "
if "%pushBranch%"=="" (
    echo.
    echo  **错误**: 分支名称不能为空！
    pause
    goto mainMenu
)
echo.
echo  正在推送分支 "%pushBranch%" 到 "%remoteName%"...
git push "%remoteName%" "%pushBranch%"
if %errorlevel% neq 0 (
    echo.
    echo  **错误**: 推送分支 "%pushBranch%" 失败，错误代码: %errorlevel%
    echo   请检查分支名称是否正确, 远程仓库配置是否正确, 或者权限是否足够。 可以尝试git remote -v 和 git branch -vv
	echo.
	echo   常见错误：
	echo.
	echo   (1) 没有推送权限：确认你是否是该仓库的贡献者，并拥有push权限
	echo   (2) 分支名称错误：确认分支名称书写正确, 大小写是否正确。
	echo   (3) 远程仓库不存在:  确认远程仓库地址配置正确，用 git remote -v 查看
    pause
    goto mainMenu
)
echo.
echo  分支 "%pushBranch%" 已成功推送到 "%remoteName%"。
pause
goto mainMenu

:pullUpstream
cls
echo.
echo ======================================================
echo  [5] 同步 Fork (从 Upstream 更新)
echo ======================================================
echo.
echo  正在切换到 master 分支...
git checkout master
if %errorlevel% neq 0 (
    echo.
    echo  **错误**: 切换到 master 分支失败，错误代码: %errorlevel%
    echo   请检查本地是否存在名为master的分支，或者是否有未提交的修改。
    pause
    goto mainMenu
)
echo.
echo  正在从 upstream 拉取 master 分支...
git pull upstream master
if %errorlevel% neq 0 (
    echo.
    echo  **错误**: 从 upstream 拉取 master 分支失败，错误代码: %errorlevel%
    echo   请检查upstream是否配置正确, 可以尝试git remote -v查看
	echo.
	echo   常见错误：
	echo.
	echo   (1) upstream 未配置：确认 upstream 已经正确设置，使用 git remote -v 查看
	echo   (2) 网络问题：确认网络连接正常
    pause
    goto mainMenu
)
echo.
echo  正在推送到 origin/master...
git push origin master
if %errorlevel% neq 0 (
    echo.
    echo  **错误**: 推送 master 分支到 origin 失败，错误代码: %errorlevel%
    echo   请检查远程仓库配置是否正确, 远程分支是否存在。 可以尝试git remote -v 和 git branch -vv
	echo.
	echo   常见错误：
	echo.
	echo   (1) 没有推送权限：确认你是否是该仓库的贡献者，并拥有push权限
	echo   (2) 远程仓库不存在:  确认远程仓库地址配置正确，用 git remote -v 查看
    pause
    goto mainMenu
)
echo.
echo  已成功从 upstream 同步并推送到 origin/master。
pause
goto mainMenu

:setupUpstream
cls
echo.
echo ======================================================
echo  [6] 设置 Upstream 仓库地址
echo ======================================================
echo.
echo  正在设置 upstream...
git remote add upstream https://github.com/Anduin2017/HowToCook.git
if %errorlevel% neq 0 (
    echo.
    echo  **错误**: 设置 upstream 失败，错误代码: %errorlevel%
    echo   请检查是否已经设置过upstream或者upstream地址是否正确。 可以尝试git remote -v查看
	echo.
	echo   常见错误：
	echo.
	echo   (1) upstream 已经存在:  确认是否重复设置，使用 git remote -v 查看
	echo   (2) 网络问题：确认网络连接正常
    pause
    goto mainMenu
)
echo.
echo  已成功设置 upstream 为 https://github.com/Anduin2017/HowToCook.git。
pause
goto mainMenu

:addRemote
cls
echo.
echo ======================================================
echo  [添加远程仓库]
echo ======================================================
echo.
set /p "newRemoteName=  请输入新的远程仓库名称: "
if "%newRemoteName%"=="" (
    echo.
    echo  **错误**: 远程仓库名称不能为空！
    pause
    goto mainMenu
)

set /p "newRemoteURL=  请输入新的远程仓库地址 (例如: git@github.com:424635328/HowToCook.git 或 https://github.com/424635328/HowToCook): "
if "%newRemoteURL%"=="" (
    echo.
    echo  **错误**: 远程仓库地址不能为空！
    pause
    goto mainMenu
)

echo.
echo  正在添加远程仓库 "%newRemoteName%"，地址为 "%newRemoteURL%" ...
git remote add "%newRemoteName%" "%newRemoteURL%"
if %errorlevel% neq 0 (
    echo.
    echo  **错误**: 添加远程仓库失败，错误代码: %errorlevel%
    echo   请检查远程仓库名称是否已存在, 或者远程仓库地址是否正确。 可以尝试git remote -v查看
    pause
    goto mainMenu
)
echo.
echo  已成功添加远程仓库 "%newRemoteName%"，地址为 "%newRemoteURL%"。
pause
goto pushBranch  REM 返回到推送分支操作

:deleteLocalBranch
cls
echo.
echo ======================================================
echo  [7] 删除本地分支
echo ======================================================
echo.
set /p "localBranch=  请输入要删除的本地分支名称: "
if "%localBranch%"=="" (
    echo.
    echo  **错误**: 分支名称不能为空！
    pause
    goto mainMenu
)

REM 检查本地分支是否存在
for /f "tokens=*" %%a in ('git branch ^| findstr "%localBranch%"') do set "branchExists=true"

if not defined branchExists (
    echo.
    echo  **错误**: 本地分支 "%localBranch%" 不存在！
    pause
    goto mainMenu
)

echo.
echo  正在删除本地分支 "%localBranch%"...
git branch -d "%localBranch%"
if %errorlevel% neq 0 (
    echo.
    echo  **错误**: 删除本地分支 "%localBranch%" 失败，错误代码: %errorlevel%
    echo   请确保分支存在且已合并。如果未合并，请使用 -D 强制删除。 可以尝试git branch查看本地分支
	echo.
	echo   常见错误：
	echo.
	echo   (1) 分支未合并:  如果确定要删除，可以使用  git branch -D "%localBranch%" (请谨慎使用)
	echo   (2) 权限问题： 确认对本地仓库有操作权限
    pause
    goto mainMenu
)
echo.
echo  已成功删除本地分支 "%localBranch%"。
pause
goto mainMenu

:deleteRemoteBranch
cls
echo.
echo ======================================================
echo  [8] 删除远程分支
echo ======================================================
echo.
set /p "remoteBranch=  请输入要删除的远程分支名称: "
if "%remoteBranch%"=="" (
    echo.
    echo  **错误**: 分支名称不能为空！
    pause
    goto mainMenu
)

REM 检查远程分支是否存在  （简化，实际更复杂，需要fetch后再检查）
echo.
echo  正在删除远程分支 "%remoteBranch%"...
git push origin --delete "%remoteBranch%"
if %errorlevel% neq 0 (
    echo.
    echo  **错误**: 删除远程分支 "%remoteBranch%" 失败，错误代码: %errorlevel%
    echo   请检查分支名称是否正确或者权限是否足够。 可以尝试git remote -v 和 git branch -vv
	echo.
	echo   常见错误：
	echo.
	echo   (1) 没有删除权限：确认你是否是该仓库的贡献者，并拥有删除远程分支的权限
	echo   (2) 远程分支不存在：确认远程分支名称是否正确
	echo   (3) 网络问题：确认网络连接正常
    pause
    goto mainMenu
)
echo.
echo  已成功删除远程分支 "%remoteBranch%"。
pause
goto mainMenu

:exit
cls
echo.
echo  感谢使用！
exit