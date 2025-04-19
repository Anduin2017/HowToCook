@echo off
chcp 65001 > nul

title HowToCook 项目贡献助手

:mainMenu
echo.
echo ============================================
echo HowToCook 项目贡献助手
echo ============================================
echo.
echo 请选择操作：
echo 1. 创建/切换分支
echo 2. 添加修改
echo 3. 提交修改
echo 4. 推送分支
echo 5. 同步 Fork
echo 6. 设置 upstream
echo 7. 删除本地分支
echo 8. 删除远程分支
echo 0. 退出
echo.
set /p "choice=请选择 (0-8): "

REM 使用更简洁的 IF 语句结构
if "%choice%"=="0" goto exit
if "%choice%"=="1" goto createBranch
if "%choice%"=="2" goto addChanges
if "%choice%"=="3" goto commitChanges
if "%choice%"=="4" goto pushBranch
if "%choice%"=="5" goto pullUpstream
if "%choice%"=="6" goto setupUpstream
if "%choice%"=="7" goto deleteLocalBranch
if "%choice%"=="8" goto deleteRemoteBranch

echo.
echo 无效的选择，请重新选择.
pause
goto mainMenu

:createBranch
echo.
echo --------------------------------------------
echo 创建并切换到新分支
echo --------------------------------------------
echo.
set /p "branchName=请输入新分支名称: "
git checkout -b "%branchName%"
if %errorlevel% neq 0 (
    echo 创建分支失败，错误代码: %errorlevel%
    echo 请检查分支名称是否合法或已存在。 可以尝试使用git branch查看已存在的分支
    pause
    goto mainMenu
)
echo 已创建并切换到分支 "%branchName%"
pause
goto mainMenu

:addChanges
echo.
echo --------------------------------------------
echo 添加修改
echo --------------------------------------------
echo.
set /p "addType=输入 a 添加所有文件, 或输入文件名添加特定文件: "
if /i "%addType%"=="a" (
    git add .
    if %errorlevel% neq 0 (
        echo 添加所有文件失败，错误代码: %errorlevel%
        echo 请检查是否在git仓库目录下运行 或者是否有文件未保存
        pause
        goto mainMenu
    )
    echo 已添加所有文件到暂存区。
) else (
    git add "%addType%"
    if %errorlevel% neq 0 (
        echo 添加文件 "%addType%" 失败，错误代码: %errorlevel%
        echo 请检查文件名 "%addType%" 是否正确, 可以使用git status查看
        pause
        goto mainMenu
    )
    echo 已添加文件 "%addType%" 到暂存区。
)
pause
goto mainMenu

:commitChanges
echo.
echo --------------------------------------------
echo 提交修改
echo --------------------------------------------
echo.
set /p "commitMessage=请输入提交信息: "
git commit -m "%commitMessage%"
if %errorlevel% neq 0 (
    echo 提交失败，错误代码: %errorlevel%
    echo 请检查暂存区是否为空(git status)或者是否有未解决的冲突(git status)。
    pause
    goto mainMenu
)
echo 提交成功，提交信息: "%commitMessage%"
pause
goto mainMenu

:pushBranch
echo.
echo --------------------------------------------
echo 推送分支到 GitHub
echo --------------------------------------------
echo.
set /p "pushBranch=请输入要推送的分支名称: "
git push origin "%pushBranch%"
if %errorlevel% neq 0 (
    echo 推送分支 "%pushBranch%" 失败，错误代码: %errorlevel%
    echo 请检查分支名称是否正确, 远程仓库配置是否正确, 或者权限是否足够。 可以尝试git remote -v 和 git branch -vv
    pause
    goto mainMenu
)
echo 分支 "%pushBranch%" 已成功推送到 origin。
pause
goto mainMenu

:pullUpstream
echo.
echo --------------------------------------------
echo 同步 Fork
echo --------------------------------------------
echo.
git checkout master
if %errorlevel% neq 0 (
    echo 切换到 master 分支失败，错误代码: %errorlevel%
    echo 请检查本地是否存在名为master的分支，或者是否有未提交的修改。
    pause
    goto mainMenu
)
git pull upstream master
if %errorlevel% neq 0 (
    echo 从 upstream 拉取 master 分支失败，错误代码: %errorlevel%
    echo 请检查upstream是否配置正确, 可以尝试git remote -v查看
    pause
    goto mainMenu
)
git push origin master
if %errorlevel% neq 0 (
    echo 推送 master 分支到 origin 失败，错误代码: %errorlevel%
    echo 请检查远程仓库配置是否正确, 远程分支是否存在。 可以尝试git remote -v 和 git branch -vv
    pause
    goto mainMenu
)
echo 已成功从 upstream 同步并推送到 origin/master。
pause
goto mainMenu

:setupUpstream
echo.
echo --------------------------------------------
echo 设置 upstream
echo --------------------------------------------
echo.
git remote add upstream https://github.com/Anduin2017/HowToCook.git
if %errorlevel% neq 0 (
    echo 设置 upstream 失败，错误代码: %errorlevel%
    echo 请检查是否已经设置过upstream或者upstream地址是否正确。 可以尝试git remote -v查看
    pause
    goto mainMenu
)
echo 已成功设置 upstream 为 https://github.com/Anduin2017/HowToCook.git。
pause
goto mainMenu

:deleteLocalBranch
echo.
echo --------------------------------------------
echo 删除本地分支
echo --------------------------------------------
echo.
set /p "localBranch=请输入要删除的本地分支名称: "
git branch -d "%localBranch%"
if %errorlevel% neq 0 (
    echo 删除本地分支 "%localBranch%" 失败，错误代码: %errorlevel%
    echo 请确保分支存在且已合并。如果未合并，请使用 -D 强制删除。 可以尝试git branch查看本地分支
    pause
    goto mainMenu
)
echo 已成功删除本地分支 "%localBranch%"。
pause
goto mainMenu

:deleteRemoteBranch
echo.
echo --------------------------------------------
echo 删除远程分支
echo --------------------------------------------
echo.
set /p "remoteBranch=请输入要删除的远程分支名称: "
git push origin --delete "%remoteBranch%"
if %errorlevel% neq 0 (
    echo 删除远程分支 "%remoteBranch%" 失败，错误代码: %errorlevel%
    echo 请检查分支名称是否正确或者权限是否足够。 可以尝试git remote -v 和 git branch -vv
    pause
    goto mainMenu
)
echo 已成功删除远程分支 "%remoteBranch%"。
pause
goto mainMenu

:exit
echo.
echo 感谢使用！
exit