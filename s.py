import os
import subprocess

def clear_screen():
    """清空屏幕"""
    os.system('cls' if os.name == 'nt' else 'clear')

def run_git_command(command_list):
    """运行 Git 命令并返回状态码和输出"""
    try:
        process = subprocess.run(command_list, capture_output=True, text=True, check=True)
        return process.returncode, process.stdout, process.stderr
    except subprocess.CalledProcessError as e:
        return e.returncode, e.stdout, e.stderr

def main_menu():
    """显示主菜单并获取用户选择"""
    clear_screen()
    print("=====================================================")
    print(" [ HowToCook 项目贡献助手 ]")
    print("=====================================================")
    print("\n 请选择操作:")
    print("\n [1]  创建/切换分支")
    print(" [2]  添加修改")
    print(" [3]  提交修改")
    print(" [4]  推送分支")
    print(" [5]  同步 Fork (从 Upstream 更新)")
    print(" [6]  设置 Upstream 仓库地址")
    print(" [9]  添加远程仓库")
    print(" [7]  删除本地分支")
    print(" [8]  删除远程分支")
    print("\n [0]  退出")
    print("\n")

    while True:
        choice = input(" 请选择 (0-9): ")
        if choice in ('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'):
            return choice
        else:
            print("\n **错误**: 无效的选择，请重新选择.")
            input("按任意键继续...")

def create_branch():
    """创建并切换到新分支"""
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
    """添加修改"""
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
    else:
        print("\n 正在添加文件", add_type, "...")
        return_code, stdout, stderr = run_git_command(["git", "add", add_type])
        if return_code != 0:
            print("\n **错误**: 添加文件", add_type, "失败，错误代码:", return_code)
            print(" 请检查文件名", add_type, " 是否正确, 可以使用git status查看")
            print(stderr)
            input("按任意键继续...")
            return
        print("\n 已添加文件", add_type, "到暂存区。")

    input("按任意键继续...")

def commit_changes():
    """提交修改"""
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
    """推送分支到 GitHub"""
    clear_screen()
    print("=====================================================")
    print(" [4] 推送分支到 GitHub")
    print("=====================================================")
    print("\n")

    print("  如果您的 fork 仓库 (git@github.com:424635328/HowToCook.git 或 https://github.com/424635328/HowToCook) 已设置为 origin，请直接回车。")
    print("  如果未设置，请输入您的 fork 仓库的远程仓库名称，或输入 'add' 添加一个新的远程仓库。")
    remote_name = input(" 请输入要推送到的远程仓库名称 (默认为 origin): ")
    if not remote_name:
        remote_name = "origin"

    if remote_name.lower() == "add":
        add_remote()  #调用新增远程仓库的函数
        remote_name = "origin" #添加完成后，将 remote_name 设置为 origin

    push_branch_name = input(" 请输入要推送的分支名称: ")
    if not push_branch_name:
        print("\n **错误**: 分支名称不能为空！")
        input("按任意键继续...")
        return

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
    """同步 Fork (从 Upstream 更新)"""
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
    """设置 Upstream 仓库地址"""
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
    """添加远程仓库"""
    clear_screen()
    print("=====================================================")
    print(" [9] 添加远程仓库")
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
    """删除本地分支"""
    clear_screen()
    print("=====================================================")
    print(" [7] 删除本地分支")
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
    """删除远程分支"""
    clear_screen()
    print("=====================================================")
    print(" [8] 删除远程分支")
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
    input("按任意键继续...")

if __name__ == "__main__":
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
        elif choice == '9':
            add_remote()
        elif choice == '7':
            delete_local_branch()
        elif choice == '8':
            delete_remote_branch()