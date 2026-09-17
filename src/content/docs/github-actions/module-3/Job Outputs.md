---
title: Job Outputs
---

## About Job Output

Job Output 不同job之间传递少量字符串或元数据，例如：

- Artifact 名称
- 版本号
- Commit SHA
- Docker image digest
- 部署 URL
- 是否需要部署


### Output数据流

```text
写入 $GITHUB_OUTPUT #step里写入
        ↓
steps.<step-id>.outputs.<name> #Job层面输出
        ↓
jobs.<job-id>.outputs.<name> #Job层面输出
        ↓
needs.<job-id>.outputs.<name> #其他Job里使用
```

## [Defining and using job outputs](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/pass-job-outputs#defining-and-using-job-outputs)

1. Open the workflow file containing the job you want to get outputs from.
    
2. Use the `jobs.<job_id>.outputs` syntax to define the outputs for the job. For example, the following job defines the `output1` and `output2` outputs, which are mapped to the results of `step1` and `step2` respectively:
    
    ```yaml
    jobs:
      job1:
        runs-on: ubuntu-latest
        outputs:
          output1: ${{ steps.step1.outputs.test }} #test=hello
          output2: ${{ steps.step2.outputs.test }} #test=world
        steps:
          - id: step1
            run: echo "test=hello" >> "$GITHUB_OUTPUT"
          - id: step2
            run: echo "test=world" >> "$GITHUB_OUTPUT"
    ```
    
3. In a separate job where you want to access those outputs, use the `jobs.<job_id>.needs` syntax to make it dependent on the original job. For example, the following job checks that `job1` is complete before running:
    
    ```yaml
    jobs:
      # Assume job1 is defined as above
      job2:
        runs-on: ubuntu-latest
        needs: job1
    ```
    
4. To access the outputs in the dependent job, use the `needs.<job_id>.outputs.<output_name>` syntax. For example, the following job accesses the `output1` and `output2` outputs defined in `job1`:
    
    ```yaml
    jobs:
      # Assume job1 is defined as above
      job2:
        runs-on: ubuntu-latest
        needs: job1
        steps:
          - env:
              OUTPUT1: ${{needs.job1.outputs.output1}}
              OUTPUT2: ${{needs.job1.outputs.output2}}
            run: echo "$OUTPUT1 $OUTPUT2"
    ```