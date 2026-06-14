import re
import sys


def main():
    path1, path2 = sys.argv[1], sys.argv[2]
    diff_file: str = sys.stdin.read()
    diff_lines = diff_file.split("\n")
    lines1, lines2 = read_lines_from_files(path1, path2)
    file1, file2 = insert_missing_lines(lines1, lines2, diff_lines)

    with open(path1, "w") as f:
        f.writelines(file1)
    with open(path2, "w") as f:
        f.writelines(file2)


def insert_missing_lines(lines1: list[str], lines2: list[str], diff_lines: list[str]):
    for i in range(len(diff_lines)):
        if diff_lines[i].endswith("<"):
            lines2.insert(i, prepare_placeholder_from(lines1[i]))
        elif diff_lines[i].lstrip().startswith(">"):
            lines1.insert(i, prepare_placeholder_from(lines2[i]))

    return lines1, lines2


def read_lines_from_files(path1, path2):
    lines1 = []
    lines2 = []

    with open(path1, "r") as f1:
        lines1 = f1.readlines()
        f1.close()
    with open(path2, "r") as f2:
        lines2 = f2.readlines()
        f2.close()
    return lines1, lines2


def prepare_placeholder_from(line: str) -> str:
    capture_key_without_value_pattern = r'(\s*".+":\s*")(.+".*)'
    return re.sub(capture_key_without_value_pattern, r"\1[CHANGE ME!] \2", line)


if __name__ == "__main__":
    main()
