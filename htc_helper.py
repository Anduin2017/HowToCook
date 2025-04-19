import os
import subprocess
import webbrowser
import urllib.parse

def clear_screen():
    """清空屏幕"""
    os.system('cls' if os.name == 'nt' else 'clear')

def run_git_command(command_list):
    """运行 Git 命令并返回状态码和输出"""
    process = None  # 初始化 process 变量
    try:
        process = subprocess.run(command_list, capture_output=True, text=True, check=True, encoding='utf-8')  # 指定编码为 utf-8
        return process.returncode, process.stdout, process.stderr
    except subprocess.CalledProcessError as e:
        if process:  # 只有当 process 已经被赋值后才访问 process.stdout 和 process.stderr
            return e.returncode, process.stdout, process.stderr
        else:
            return e.returncode, "", str(e) # 返回空字符串和异常信息

def main_menu():
    """显示主菜单并获取用户选择"""
    clear_screen()
    print("=====================================================")
    print(" [ HowToCook 项目贡献助手 ]")
    print("=====================================================")
    print("\n 请选择操作:")
    print("\n [1]  创建/切换分支       (git checkout -b <branch_name>)")
    print(" [2]  添加修改            (git add . 或 git add <file_name>)")
    print(" [3]  提交修改            (git commit --file temp_commit_message.txt)")
    print(" [4]  推送分支            (git push <remote_name> <branch_name>)")
    print(" [5]  同步 Fork (Upstream) (git checkout master, git pull upstream master, git push origin master)")
    print(" [6]  设置 Upstream地址    (git remote add upstream <url>)")
    print(" [7]  删除本地分支        (git branch -d <local_branch_name>)")
    print(" [8]  删除远程分支        (git push origin --delete <remote_branch_name>)")
    print(" [9]  添加远程仓库        (git remote add <remote_name> <remote_url>)")
    print(" [10] 创建 Pull Request    (生成 URL 手动创建)")
    print(" [11] 清理 Commits (极其危险!)  (git reset --hard HEAD~<number_of_commits>)")
    print("\n [0]  退出")
    print("\n")

    while True:
        choice = input(" 请选择 (0-11): ")
        if choice in ('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'):
            return choice
        else:
            print("\n **错误**: 无效的选择，请重新选择.")
            input("按任意键继续...")

def create_branch():
    """创建并切换到新分支
    命令: git checkout -b <branch_name>
    """
    clear_screen()
    print("=====================================================")
    print(" [1] 创建并切换到新分支")
    print("=====================================================")
    print("\n")

    branch_name = input(" 请输入新分支名称: ")
    if not branch_name:
        print("\n **错误**: 分支名称不能为空！")
        input("按任意键继续...")
        return

    print("\n 正在创建并切换到分支", branch_name, "...")
    return_code, stdout, stderr = run_git_command(["git", "checkout", "-b", branch_name])

    if return_code != 0:
        print("\n **错误**: 创建分支失败，错误代码:", return_code)
        print(" 请检查分支名称是否合法或已存在。 可以尝试使用git branch查看已存在的分支")
        print(stderr)
        input("按任意键继续...")
        return

    print("\n 已成功创建并切换到分支", branch_name)
    input("按任意键继续...")

def add_changes():
    """添加修改
    命令: git add .  (添加所有文件)
         git add <file_name> (添加指定文件)
    """
    clear_screen()
    print("=====================================================")
    print(" [2] 添加修改")
    print("=====================================================")
    print("\n [a]  添加所有文件")
    print(" [文件名] 添加指定文件 (例如： README.md)")
    print("\n")

    add_type = input(" 请输入选项 (a 或 文件名): ")
    if add_type.lower() == 'a':
        print("\n 正在添加所有文件...")
        return_code, stdout, stderr = run_git_command(["git", "add", "."])
        if return_code != 0:
            print("\n **错误**: 添加所有文件失败，错误代码:", return_code)
            print(" 请检查是否在git仓库目录下运行 或者是否有文件未保存")
        print(stderr)
        input("按任意键继续...")
        return

    print("\n 已添加所有文件到暂存区。")
    input("按任意键继续...")

def commit_changes():
    """提交修改
    命令: git commit --file temp_commit_message.txt
    """
    clear_screen()
    print("=====================================================")
    print(" [3] 提交修改")
    print("=====================================================")
    print("\n")

    commit_message = input(" 请输入提交信息: ")
    try:
        with open("temp_commit_message.txt", "w", encoding="utf-8") as f:
            f.write(commit_message)
    except Exception as e:
        print(f"\n**错误**: 创建临时文件失败: {e}")
        input("按任意键继续...")
        return

    print("\n 正在提交修改...")
    return_code, stdout, stderr = run_git_command(["git", "commit", "--file", "temp_commit_message.txt"])

    if return_code != 0:
        print("\n **错误**: 提交失败，错误代码:", return_code)
        print(" 请检查暂存区是否为空(git status)或者是否有未解决的冲突(git status)。")
        print(stderr)
        os.remove("temp_commit_message.txt")
        input("按任意键继续...")
        return

    print("\n 提交成功，提交信息:", commit_message)
    os.remove("temp_commit_message.txt")
    input("按任意键继续...")

def push_branch():
    """推送分支到 GitHub
    命令: git push <remote_name> <branch_name>
    """
    clear_screen()
    print("=====================================================")
    print(" [4] 推送分支到 GitHub")
    print("=====================================================")
    print("\n")

    print(f"  如果您的 fork 仓库 (git@github.com/{fork_username}/HowToCook.git 或 https://github.com/{fork_username}/HowToCook) 已设置为 origin，请直接回车。") # 修改了提示语
    print("  如果未设置，请输入您的 fork 仓库的远程仓库名称，或输入 'add' 添加一个新的远程仓库。")
    remote_name = input(" 请输入要推送到的远程仓库名称 (默认为 origin): ")
    if not remote_name:
        remote_name = "origin"

    if remote_name.lower() == "add":
        add_remote()  #调用新增远程仓库的函数
        remote_name = "origin" #添加完成后，将 remote_name 设置为 origin

    push_branch_name = input(" 请输入要推送的分支名称 (默认为 master, 直接回车使用默认值): ") #修改了提示语
    if not push_branch_name:
        push_branch_name = "master"  # 如果用户没有输入，则使用 "master" 作为默认值

    print("\n 正在拉取远程分支", push_branch_name, "的最新更改...")
    return_code, stdout, stderr = run_git_command(["git", "pull", remote_name, push_branch_name])
    if return_code != 0:
        print("\n **错误**: 拉取远程更改失败，错误代码:", return_code)
        print("  请检查您的网络连接, 远程仓库地址是否正确，以及是否存在冲突。请手动解决冲突后重试。")
        print(stderr)
        input("按任意键继续...")
        return

    print("\n 正在推送分支", push_branch_name, "到", remote_name, "...")
    return_code, stdout, stderr = run_git_command(["git", "push", remote_name, push_branch_name])
    if return_code != 0:
        print("\n **错误**: 推送分支", push_branch_name, "失败，错误代码:", return_code)
        print("  请检查分支名称是否正确, 远程仓库配置是否正确, 或者权限是否足够。 可以尝试git remote -v 和 git branch -vv")
        print("\n  常见错误：")
        print("\n  (1) 没有推送权限：确认你是否是该仓库的贡献者，并拥有push权限")
        print("  (2) 分支名称错误：确认分支名称书写正确, 大小写是否正确。")
        print("  (3) 远程仓库不存在:  确认远程仓库地址配置正确，用 git remote -v 查看")
        print("  (4) 您的本地分支落后于远程分支，请先拉取远程更改。")
        print(stderr)
        input("按任意键继续...")
        return

    print("\n 分支", push_branch_name, "已成功推送到", remote_name, "。")
    input("按任意键继续...")

def pull_upstream():
    """同步 Fork (从 Upstream 更新)
    命令: git checkout master
         git pull upstream master
         git push origin master
    """
    clear_screen()
    print("=====================================================")
    print(" [5] 同步 Fork (从 Upstream 更新)")
    print("=====================================================")
    print("\n")

    print(" 正在切换到 master 分支...")
    return_code, stdout, stderr = run_git_command(["git", "checkout", "master"])
    if return_code != 0:
        print("\n **错误**: 切换到 master 分支失败，错误代码:", return_code)
        print("  请检查本地是否存在名为master的分支，或者是否有未提交的修改。")
        print(stderr)
        input("按任意键继续...")
        return

    print("\n 正在从 upstream 拉取 master 分支...")
    return_code, stdout, stderr = run_git_command(["git", "pull", "upstream", "master"])
    if return_code != 0:
        print("\n **错误**: 从 upstream 拉取 master 分支失败，错误代码:", return_code)
        print("  请检查upstream是否配置正确, 可以尝试git remote -v查看")
        print("\n  常见错误：")
        print("\n  (1) upstream 未配置：确认 upstream 已经正确设置，使用 git remote -v 查看")
        print("  (2) 网络问题：确认网络连接正常")
        print(stderr)
        input("按任意键继续...")
        return

    print("\n 正在推送到 origin/master...")
    return_code, stdout, stderr = run_git_command(["git", "push", "origin", "master"])
    if return_code != 0:
        print("\n **错误**: 推送 master 分支到 origin 失败，错误代码:", return_code)
        print("  请检查远程仓库配置是否正确, 远程分支是否存在。 可以尝试git remote -v 和 git branch -vv")
        print("\n  常见错误：")
        print("\n  (1) 没有推送权限：确认你是否是该仓库的贡献者，并拥有push权限")
        print("  (2) 远程仓库不存在:  确认远程仓库地址配置正确，用 git remote -v 查看")
        print(stderr)
        input("按任意键继续...")
        return

    print("\n 已成功从 upstream 同步并推送到 origin/master。")
    input("按任意键继续...")

def setup_upstream():
    """设置 Upstream 仓库地址
    命令: git remote add upstream https://github.com/Anduin2017/HowToCook.git
    """
    clear_screen()
    print("=====================================================")
    print(" [6] 设置 Upstream 仓库地址")
    print("=====================================================")
    print("\n")

    print(" 正在设置 upstream...")
    return_code, stdout, stderr = run_git_command(["git", "remote", "add", "upstream", "https://github.com/Anduin2017/HowToCook.git"])
    if return_code != 0:
        print("\n **错误**: 设置 upstream 失败，错误代码:", return_code)
        print("  请检查是否已经设置过upstream或者upstream地址是否正确。 可以尝试git remote -v查看")
        print("\n  常见错误：")
        print("\n  (1) upstream 已经存在:  确认是否重复设置，使用 git remote -v 查看")
        print("  (2) 网络问题：确认网络连接正常")
        print(stderr)
        input("按任意键继续...")
        return

    print("\n 已成功设置 upstream 为 https://github.com/Anduin2017/HowToCook.git。")
    input("按任意键继续...")

def add_remote():
    """添加远程仓库
    命令: git remote add <remote_name> <remote_url>
    """
    clear_screen()
    print("=====================================================")
    print(" [7] 添加远程仓库")
    print("=====================================================")
    print("\n")

    new_remote_name = input(" 请输入新的远程仓库名称: ")
    if not new_remote_name:
        print("\n **错误**: 远程仓库名称不能为空！")
        input("按任意键继续...")
        return

    new_remote_url = input(" 请输入新的远程仓库地址 (例如: git@github.com:424635328/HowToCook.git 或 https://github.com/424635328/HowToCook): ")
    if not new_remote_url:
        print("\n **错误**: 远程仓库地址不能为空！")
        input("按任意键继续...")
        return

    print("\n 正在添加远程仓库", new_remote_name, "，地址为", new_remote_url, "...")
    return_code, stdout, stderr = run_git_command(["git", "remote", "add", new_remote_name, new_remote_url])
    if return_code != 0:
        print("\n **错误**: 添加远程仓库失败，错误代码:", return_code)
        print("  请检查远程仓库名称是否已存在, 或者远程仓库地址是否正确。 可以尝试git remote -v查看")
        print(stderr)
        input("按任意键继续...")
        return

    print("\n 已成功添加远程仓库", new_remote_name, "，地址为", new_remote_url, "。")
    input("按任意键继续...")

def delete_local_branch():
    """删除本地分支
    命令: git branch -d <local_branch_name>
    """
    clear_screen()
    print("=====================================================")
    print(" [8] 删除本地分支")
    print("=====================================================")
    print("\n")

    local_branch = input(" 请输入要删除的本地分支名称: ")
    if not local_branch:
        print("\n **错误**: 分支名称不能为空！")
        input("按任意键继续...")
        return

    # 检查本地分支是否存在
    return_code, stdout, stderr = run_git_command(["git", "branch"])
    if return_code != 0:
        print("\n **错误**: 获取本地分支列表失败！")
        print(stderr)
        input("按任意键继续...")
        return

    branch_exists = False
    for line in stdout.splitlines():
        if local_branch in line:
            branch_exists = True
            break

    if not branch_exists:
        print("\n **错误**: 本地分支", local_branch, "不存在！")
        input("按任意键继续...")
        return

    print("\n 正在删除本地分支", local_branch, "...")
    return_code, stdout, stderr = run_git_command(["git", "branch", "-d", local_branch])
    if return_code != 0:
        print("\n **错误**: 删除本地分支", local_branch, "失败，错误代码:", return_code)
        print("  请确保分支存在且已合并。如果未合并，请使用 -D 强制删除。 可以尝试git branch查看本地分支")
        print("\n  常见错误：")
        print("\n  (1) 分支未合并:  如果确定要删除，可以使用  git branch -D", local_branch, "(请谨慎使用)")
        print("  (2) 权限问题： 确认对本地仓库有操作权限")
        print(stderr)
        input("按任意键继续...")
        return

    print("\n 已成功删除本地分支", local_branch, "。")
    input("按任意键继续...")

def delete_remote_branch():
    """删除远程分支
    命令: git push origin --delete <remote_branch_name>
    """
    clear_screen()
    print("=====================================================")
    print(" [9] 删除远程分支")
    print("=====================================================")
    print("\n")

    remote_branch = input(" 请输入要删除的远程分支名称: ")
    if not remote_branch:
        print("\n **错误**: 分支名称不能为空！")
        input("按任意键继续...")
        return

    print("\n 正在删除远程分支", remote_branch, "...")
    return_code, stdout, stderr = run_git_command(["git", "push", "origin", "--delete", remote_branch])
    if return_code != 0:
        print("\n **错误**: 删除远程分支", remote_branch, "失败，错误代码:", return_code)
        print("  请检查分支名称是否正确或者权限是否足够。 可以尝试git remote -v 和 git branch -vv")
        print("\n  常见错误：")
        print("\n  (1) 没有删除权限：确认你是否是该仓库的贡献者，并拥有删除远程分支的权限")
        print("  (2) 远程分支不存在：确认远程分支名称是否正确")
        print("  (3) 网络问题：确认网络连接正常")
        print(stderr)
        input("按任意键继续...")
        return

    print("\n 已成功删除远程分支", remote_branch, "。")
    input("\n按任意键继续...")

def create_pull_request():
    """创建 Pull Request (实际上是生成 URL 并提示用户手动创建)
    命令：无 (需要用户手动操作)
    """
    clear_screen()
    print("=====================================================")
    print(" [10] 创建 Pull Request")
    print("=====================================================")
    print("\n")

    # 构建 URL

    head_repo = f"{fork_username}:{branch_name}"  # 构建 head repo 名称
    # urlencode 分支名称和 PR 标题，以处理特殊字符
    encoded_head = urllib.parse.quote(head_repo)
    encoded_title = urllib.parse.quote("简明扼要地描述你的修改")

    pr_body = """## 注意

Pull Request 提交后，预计 1 分钟内将会得到自动化格式检查的结果。只有通过自动化代码检查的结果。

- [ ] 请确保此 Pull Request 能够通过自动化代码检查。

## 签署

必须签署下面的对话框才能开始审核。

### HowToCook 仓库采用了 [The Unlicense](https://unlicense.org/) 协议

菜谱在签入前，必须确保其可以**直接声明进入 "公共领域"（public domain)**。这意味着一旦合并后，任何人都**可以**自由复制，修改，发布，使用，编译，出售或以菜谱的形式或菜的形式分发，**无论**是出于**商业目的**还是**非商目的**，以及**任何**手段。

- [ ] 我确保了我的内容不涉及版权内容，并且授权它 The Unlicense 协议。
"""

    pr_url = f"https://github.com/{base_repo}/compare/master...{encoded_head}?title={encoded_title}&body={urllib.parse.quote(pr_body)}"

    print("\n 请复制以下 URL 到你的浏览器中，手动创建 Pull Request：")
    print(pr_url)

    # 尝试使用 web browser 打开 URL， 如果失败，至少URL已经显示给用户了。
    try:
        webbrowser.open(pr_url)
    except webbrowser.Error:
        print("无法自动打开浏览器，请手动复制 URL。")

    input("\n按任意键继续...")

def clean_commits():
    """清理 Commits (使用 git reset --hard)
    **极其危险操作**:  将会永久丢弃未推送的 commits!  使用前请务必备份!
    **用途：** 整理本地的提交历史，例如合并/修改 commit、删除实验性 commit。 **非日常操作！**
    **命令：** git reset --hard HEAD~<number_of_commits>

    **详细解释：**
    假设你的 commit 历史如下：
    A -- B -- C -- D -- E  (HEAD -> main)
    其中 HEAD 指针指向最新的提交 E。

    `git reset --hard HEAD~2`  会将你的仓库回退到提交 C 的状态：
    1. **移动 HEAD 指针：**  HEAD 指针从 E 移动到 C。
    2. **重置暂存区和工作目录：**  暂存区 (staging area) 和工作目录 (working directory) 会被强制重置，与提交 C 的状态完全一致。
    3. **永久丢失：** 提交 D 和 E 的更改（以及任何未提交的本地更改）都将 **永久丢失**。

    **操作步骤：**
    1.  **强烈建议** 在操作前创建备份分支（`git branch backup-before-reset`）。
    2.  **确认要保留的 commit 数量。**  （输入0 则清空所有 commit，回到最初状态）
    3.  **输入数量并再次确认。**
    4.  **执行 `git reset --hard HEAD~{num_commits}`。**
    5.  **（如果需要同步远程） 慎重使用 `git push --force origin <branch_name>`。**
    """
    clear_screen()
    print("=====================================================")
    print(" [11] 清理 Commits (极其危险!)")
    print("=====================================================")
    print("\n")

    print("  **警告：此操作会永久丢弃你本地分支上未推送的 commits! 使用前请务必备份你的代码!**")
    print("  **强烈建议：** 在执行此操作之前，创建一个备份分支： `git branch backup-before-reset`") # 强调备份
    print("  **详细解释：** \n   此操作会将你的仓库回退到指定的 commit 状态，并永久删除之后的 commits。\n   例如，如果你选择回退最近的2个 commit，那么你仓库将会回到倒数第三个commit的状态， 最近两个commit会被永久删除")
    print("  请谨慎选择要删除的 commits 个数。 ")
    print("  **用途：** 整理本地的提交历史，例如合并/修改 commit、删除实验性 commit。 **非日常操作！**") # 增加用途说明

    num_commits = input("\n  要回退多少个 commits？ (输入数字并回车，输入0则清空所有commit): ")
    if not num_commits:
        print("\n **错误**: 必须输入要丢弃的 commits 数量！ 操作已取消。")
        input("\n按任意键继续...")
        return

    try:
        num_commits = int(num_commits)
        if num_commits < 0:
            print("\n **错误**: commit 数量必须是非负整数！ 操作已取消。")
            input("\n按任意键继续...")
            return
    except ValueError:
        print("\n **错误**: 输入的不是有效的整数！ 操作已取消。")
        input("\n按任意键继续...")
        return

    # 再次发出警告
    print("\n  **再次警告： 你确定要丢弃最近的 {} 个 commit 之后的所有 commits 吗？此操作不可撤销！**".format(num_commits))
    confirmation = input("  输入 'yes' 继续，输入其他任何内容取消操作： ")
    if confirmation.lower() != "yes":
        print("\n操作已取消。")
        input("\n按任意键继续...")
        return

    reset_command = f"git reset --hard HEAD~{num_commits}"

    print(f"\n  执行命令： {reset_command}")  # 显示将要执行的命令

    return_code, stdout, stderr = run_git_command(["git", "reset", "--hard", f"HEAD~{num_commits}"])

    if return_code != 0:
        print("\n **错误**: reset 失败，请检查您的操作。")
        print(stderr)
    else:
        print("\n  成功重置到 HEAD~{}!".format(num_commits))
        print("  **注意： 你的本地更改可能已经被丢弃，请检查你的工作目录。**")
        print("  **重要： 如果需要同步远程仓库，请谨慎使用 git push --force origin <branch_name>，将更改推送到远程仓库，  将远程仓库也更新，否则创建pull request的时候还会看到之前的commits!**")
        print("  **`--force` 会覆盖远程仓库的历史！ 请只在自己完全掌控的私有分支上使用！**") # 更加强烈的警告
        print("  **如果多人协作开发，强制推送可能会导致严重问题！ 请三思！**")

    input("\n按任意键继续...")


if __name__ == "__main__":
    # 在主循环开始前设置变量
    clear_screen()
    fork_username = input("请输入你的 GitHub 用户名 (你的 Fork 仓库的所有者): ")
    if not fork_username:
        print("\n **错误**: GitHub 用户名不能为空！ 将使用默认值 '424635328'。")
        fork_username = "424635328"  # 使用默认值

    base_repo = input("请输入原始仓库的名称 (默认为 Anduin2017/HowToCook): ")
    if not base_repo:
        base_repo = "Anduin2017/HowToCook"
    print(f"\n已设置 GitHub 用户名为: {fork_username}")
    print(f"已设置原始仓库为: {base_repo}")
    input("\n按任意键继续...")
    branch_name = "" # 先声明branch_name

    while True:
        choice = main_menu()

        if choice == '0':
            clear_screen()
            print("\n 感谢使用！")
            break
        elif choice == '1':
            create_branch()
        elif choice == '2':
            add_changes()
        elif choice == '3':
            commit_changes()
        elif choice == '4':
            push_branch()
        elif choice == '5':
            pull_upstream()
        elif choice == '6':
            setup_upstream()
        elif choice == '7':
            delete_local_branch()
        elif choice == '8':
            delete_remote_branch()
        elif choice == '9':
            add_remote()
        elif choice == '10':
            create_pull_request()   # 新增 PR 功能
        elif choice == '11':
            clean_commits()
        else:
            print("\n **错误**: 无效的选择！")
            input("\n按任意键继续...")
            
            