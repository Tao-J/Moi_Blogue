---
layout: post
title: Hands on guide for using Chisel.
title_real: Chisel中文教程-入门
lang: cn
series:
  - riscv
---
## 准备软件
正确安装并配置jdk。环境变量PATH里需保证jdk的java得比系统自带的java优先级高。
下载安装[sbt](www.scala-sbt.org)。
一般的文本编辑器编辑Scala代码也未尝不可，不过建议用[IntelliJ IDEA](www.jetbrains.com/idea/)，提升效率。
如需使用Chisel的C++仿真功能，安装gcc/g++。Windows下建议用[Cygwin](www.cygwin.com)。
同时Chisel仿真时可生成波形，用[gtkwave](gtkwave.sourceforge.net)可以查看。

## Chisel工作流
### 建立工程文件夹
整个demo工程文件夹所有文件如下所示。本指南会按顺序提供每个文件的内容，没有提到的文件可暂时不创建。

```
demo/
├── build.sbt
├── run.sh
├── project
│   └── build.properties
└── src
    └── main
        └── scala
            └── Alu.scala
```

#### 文件内容
`build.sbt`：注意其中每两行之间都有一空行。

```
organization := "cn.edu.zju.cs"

version := "0.1"

name := "demo"

scalaVersion := "2.10.4"

scalacOptions ++= Seq("-deprecation", "-feature", "-unchecked", "-language:reflectiveCalls")

val chiselVersion_h = System.getProperty("chiselVersion", "latest.release")

libraryDependencies ++= ( if (chiselVersion_h != "None" ) ("edu.berkeley.cs" %% "chisel" % chiselVersion_h) :: Nil; else Nil)
```
`build.properties`
```
sbt.version=0.13.6
```

#### 编写硬件描述代码
`Alu.scala`

```scala
import Chisel._

class Alu extends Module {
  val io = new Bundle {
    val a = UInt(INPUT, 32)
    val b = UInt(INPUT, 32)
    val opcode = UInt(INPUT, 3)
    val out = UInt(OUTPUT, 32)
  }

  io.out := MuxCase(UInt(0),
    Array(
      (io.opcode === UInt(0)) -> (io.a + io.b),
      (io.opcode === UInt(1)) -> (io.a - io.b),
      (io.opcode === UInt(2)) -> (io.a & io.b),
      (io.opcode === UInt(3)) -> (io.a | io.b),
      (io.opcode === UInt(4)) -> (io.a ^ io.b),
      (io.opcode === UInt(5)) -> (io.a >> io.b),
      (io.opcode === UInt(6)) -> (io.a << io.b)
    )
  )

}

class AluTests(c: Alu) extends Tester(c) {
}


object Alu {
  def main(args: Array[String]): Unit = {
    args.foreach(arg => println(arg))
    chiselMainTest(args, () => Module(new Alu())) {
      c => new AluTests(c) }
  }
}

```

`cd`到工程的根文件夹下（即和`build.sbt`平行）。然后在命令行中执行`sbt run`来编译代码。
第一次运行编译时会自动下载Chisel以及相关依赖包，具体时间取决于网络质量。成功运行一次后将直接从本地调用。
如果编译通过的话可以用`sbt "run --backend v"`生成Verilog，不过没测试过的代码直接下板调试似乎不太合适。

### 编写测试代码
`Alu.scala`：补全`class AluTests(c: Alu) extends Tester(c)`里的测试代码。

```scala
class AluTests(c: Alu) extends Tester(c) {

  for (i <- 0 until 7) {
    val a      = rnd.nextInt(1 << 16)
    val b      = rnd.nextInt(1 << 4)
    val opcode = i
    var output = 0
    if (opcode == 0) {
      output = ((a+b) & 0xFFFFFFFF)
    } else if (opcode == 1) {
      output = ((a-b) & 0xFFFFFFFF)
    } else if (opcode == 2) {
      output = ((a&b) & 0xFFFFFFFF)
    } else if (opcode == 3) {
      output = ((a|b) & 0xFFFFFFFF)
    } else if (opcode == 4) {
      output = ((a^b) & 0xFFFFFFFF)
    } else if (opcode == 5) {
      output = ((a>>b) & 0xFFFFFFFF)
    } else if (opcode == 6) {
      output = ((a<<b) & 0xFFFFFFFF)
    } else if (opcode == 7) {
      output = (0 & 0xFFFFFFFF)
    }
    poke(c.io.a, a)
    poke(c.io.b, b)
    poke(c.io.opcode, opcode)
    step(1)
    expect(c.io.out, output)
  }

}

```

生成C++仿真代码，并运行测试。

```
sbt "run --backend c --compile --genHarness --test"
```

可选参数
` --debug`除了调试io接口外，内部逻辑也能调试，也就是说可以对除了io口意外的逻辑进行peek/poke。
` --vcd`可生成波形辅助调试。用gtkwave打开生成的vcd文件。
` --debugMem`调试Mem，可以对一个Mem类型元素执行peekAt/pokeAt。
` --vcdMem`生成波形文件时将Mem内容也导出。

选择`--vcd`后产生的vcd文件用gtkwave打开即可。
可以通过"Write Save File"来保存当前工作环境，这样下次就不用一个个手动添加信号线了。
”Reload Waveform“可以在vcd文件更新后重新载入，十分方便。

### 结束
生成Verilog代码，进入传统工作流下板验证。

```
sbt "run --backend v"
```

可选参数
`--genHarness`：生成一个空的Verilog test bench。
###传统工作流
+ 将生成的Verilog代码导入ISE/Quartus/Diamond工程中。
+ 可使用`Alu-harness.v`仿真。
	+ 这个文件是按照与Synposys [VCS](http://www.synopsys.com/Tools/Verification/FunctionalVerification/Pages/VCS.aspx)兼容的方式写的，用别的工具调用需修改过。

+ 执行Verilog仿真（小于1M Cycle建议采用Chisel仿真）
+ 下板验证

## 和直接使用Verilog的一些对比
`alu.v`

```verilog
module Alu (/*AUTOARG*/
   // Outputs
   out,
   // Inputs
   a, b, s
   );

   input [31:0]    a;
   input [31:0]    b;
   input [3:0]     s;
   output [31:0]   out;

   reg [31:0]      out;
   always @*
     begin
        case(s)
          3'b000: out = a + b;
          3'b001: out = a - b;
          3'b010: out = a & b;
          3'b011: out = a | b;
          3'b100: out = a ^ b;
          3'b101: out = a << b;
          3'b110: out = a >> b;
        endcase
     end

endmodule
```

首先Alu应该是一个组合逻辑。上面Verilog代码为了使用case不得不写了always模块，并且声明了out为寄存器变量，综合出来的结果中会有寄存器，但是按照常理来说不应该有寄存器。当然Verilog里面使用三目运算符也能达到全组合逻辑的效果，不过写起来十分麻烦罢了。


### 使用Chisel的优点

+ 写测试代码十分方便，强调先测试仿真通过了再下板。Verilog的test bench太繁琐。
+ 编辑代码可以使用IDE，效率大大提高。
+ 端口声明修改方便，不像改一个名字得修改上下两处代码。
+ 实例化模块并连线方便，不用一条条线连，直接总线对接。
+ 避开使用看不清楚的begin-end对来包裹代码。
+ 组合逻辑时序逻辑区别清晰。
	+ 比如，多周期CPU中计算下一个状态(next-state)时应该使用组合逻辑，所有中间变量都应该是wire类型，只有状态(state)寄存器声明成reg变量，每次在时钟上升沿更新为组合逻辑生成的next-state。
	+ 并不一定能用手写出很好的Verilog代码，所以让自动化工具生成合适的代码。

（实例待添加）

## 附：自动侦测修改并编译
若输入时不用`sbt "run --test"`而用`sbt "~run --test"`的话，每次完成后sbt不会退出，而会等待源码修改，帧测到修改后自动编译。
由于输入命令较多，这里提供一个脚本，每次就不用重复输入命令了。
`run.sh`

```bash
if [ "$1" == "clean" ]
then
    rm -rf emulator*
    rm -rf Alu*
    rm -rf target*
    rm -rf project/target*
fi

if [ "$1" == "c" ]
then
    sbt "~run --backend c --compile --genHarness --test --debug --vcd --debugMem --vcdMem"
fi

if [ "$1" == "v" ]
then
    sbt "~run --backend v --genHarness"
fi
```

用法：
`bash run.sh c`生成仿真文件并测试。
`bash run.sh v`生成Verilog文件。
`bash run.sh clean`清理所有零时文件，包括生成的C++/Verilog文件。
####附件：综合以及布线报告
Target Device: ZC7020  
Vivado 2014.4

`alu.v`

```
---------------------------------------------------------------------------------
Start RTL Hierarchical Component Statistics
---------------------------------------------------------------------------------
Hierarchical RTL Component report
Module Alu
Detailed RTL Component Info :
+---Adders :
           3 Input     32 Bit       Adders := 1
+---XORs :
           2 Input     32 Bit         XORs := 1
+---Muxes :
           2 Input     32 Bit        Muxes := 1
           8 Input     32 Bit        Muxes := 1
           2 Input      1 Bit        Muxes := 1
           8 Input      1 Bit        Muxes := 1
---------------------------------------------------------------------------------
Finished RTL Hierarchical Component Statistics
---------------------------------------------------------------------------------

+-------------------------+------+-------+-----------+-------+
|        Site Type        | Used | Fixed | Available | Util% |
+-------------------------+------+-------+-----------+-------+
| Slice LUTs              |  268 |     0 |     53200 |  0.50 |
|   LUT as Logic          |  268 |     0 |     53200 |  0.50 |
|   LUT as Memory         |    0 |     0 |     17400 |  0.00 |
| Slice Registers         |   32 |     0 |    106400 |  0.03 |
|   Register as Flip Flop |    0 |     0 |    106400 |  0.00 |
|   Register as Latch     |   32 |     0 |    106400 |  0.03 |
| F7 Muxes                |   32 |     0 |     26600 |  0.12 |
| F8 Muxes                |    0 |     0 |     13300 |  0.00 |
+-------------------------+------+-------+-----------+-------+

+-------------------------------------------------------------+---------+-------+-----------+-------+
|                          Site Type                          |   Used  | Fixed | Available | Util% |
+-------------------------------------------------------------+---------+-------+-----------+-------+
| Slice                                                       |      81 |     0 |     13300 |  0.60 |
|   SLICEL                                                    |      57 |     0 |           |       |
|   SLICEM                                                    |      24 |     0 |           |       |
| LUT as Logic                                                |     268 |     0 |     53200 |  0.50 |
|   using O5 output only                                      |       0 |       |           |       |
|   using O6 output only                                      |     189 |       |           |       |
|   using O5 and O6                                           |      79 |       |           |       |
| LUT as Memory                                               |       0 |     0 |     17400 |  0.00 |
|   LUT as Distributed RAM                                    |       0 |     0 |           |       |
|   LUT as Shift Register                                     |       0 |     0 |           |       |
| LUT Flip Flop Pairs                                         |     268 |     0 |     53200 |  0.50 |
|   fully used LUT-FF pairs                                   |      32 |       |           |       |
|   LUT-FF pairs with unused LUT                              |       0 |       |           |       |
|   LUT-FF pairs with unused Flip Flop                        |     236 |       |           |       |
| Unique Control Sets                                         |       1 |       |           |       |
| Minimum number of registers lost to control set restriction | 0(Lost) |       |           |       |
+-------------------------------------------------------------+---------+-------+-----------+-------+
```

`Alu.scala`

```
---------------------------------------------------------------------------------
Start RTL Hierarchical Component Statistics
---------------------------------------------------------------------------------
Hierarchical RTL Component report
Module Alu
Detailed RTL Component Info :
+---Adders :
           3 Input     32 Bit       Adders := 1
+---XORs :
           2 Input     32 Bit         XORs := 1
+---Muxes :
           3 Input     32 Bit        Muxes := 3
           2 Input     32 Bit        Muxes := 5
---------------------------------------------------------------------------------
Finished RTL Hierarchical Component Statistics
---------------------------------------------------------------------------------

+-------------------------+------+-------+-----------+-------+
|        Site Type        | Used | Fixed | Available | Util% |
+-------------------------+------+-------+-----------+-------+
| Slice LUTs              |  285 |     0 |     53200 |  0.53 |
|   LUT as Logic          |  285 |     0 |     53200 |  0.53 |
|   LUT as Memory         |    0 |     0 |     17400 |  0.00 |
| Slice Registers         |    0 |     0 |    106400 |  0.00 |
|   Register as Flip Flop |    0 |     0 |    106400 |  0.00 |
|   Register as Latch     |    0 |     0 |    106400 |  0.00 |
| F7 Muxes                |    0 |     0 |     26600 |  0.00 |
| F8 Muxes                |    0 |     0 |     13300 |  0.00 |
+-------------------------+------+-------+-----------+-------+

+-------------------------------------------------------------+---------+-------+-----------+-------+
|                          Site Type                          |   Used  | Fixed | Available | Util% |
+-------------------------------------------------------------+---------+-------+-----------+-------+
| Slice                                                       |      82 |     0 |     13300 |  0.61 |
|   SLICEL                                                    |      61 |     0 |           |       |
|   SLICEM                                                    |      21 |     0 |           |       |
| LUT as Logic                                                |     285 |     0 |     53200 |  0.53 |
|   using O5 output only                                      |       1 |       |           |       |
|   using O6 output only                                      |     223 |       |           |       |
|   using O5 and O6                                           |      61 |       |           |       |
| LUT as Memory                                               |       0 |     0 |     17400 |  0.00 |
|   LUT as Distributed RAM                                    |       0 |     0 |           |       |
|   LUT as Shift Register                                     |       0 |     0 |           |       |
| LUT Flip Flop Pairs                                         |     284 |     0 |     53200 |  0.53 |
|   fully used LUT-FF pairs                                   |       0 |       |           |       |
|   LUT-FF pairs with unused LUT                              |       0 |       |           |       |
|   LUT-FF pairs with unused Flip Flop                        |     284 |       |           |       |
| Unique Control Sets                                         |       0 |       |           |       |
| Minimum number of registers lost to control set restriction | 0(Lost) |       |           |       |
+-------------------------------------------------------------+---------+-------+-----------+-------+

```
