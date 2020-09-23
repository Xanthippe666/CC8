<template>

  <div id="cli">

    <div id="history">
      <div v-for="(command, index) in commandHistory" :key="index">
        <label class="commandTag" for="">{{index}}>> </label>
        <span class="command"> {{ command }} </span>
      </div>
    </div>


    <table id='internalRegs'>
      <tr>
        <td>register</td>
        <td>值</td>
      </tr>
      <tr v-for="(value, key) in debug" :key="key">
        <td>{{key}}</td>
        <td>{{value}}</td>
      </tr>
    </table>

  </div>

</template>

<script>
export default {
  name: 'Chip8Debugger',
  props: {
      debug: {
          type: Object,
          // Object or array defaults must be returned from
          // a factory function
          default: function () {
            return {
                  V: new Uint8Array(16),
                  I: new Uint16Array(1),
                  DELAY: new Uint8Array(1),
                  SOUND: new Uint8Array(1),
                  PC: new Uint16Array(1),
                  SP: new Uint8Array(1),
                  STACK: Uint16Array(16),
                  RAM: Uint8Array(32),
                }
          }
      },
      commandHistory: {
        type: Array,
        default: function () {
          return ['asdf', 'b',]
        }
      }
  },
  data () {
    return {
      // visuals
      // commandHistory: ['asdf', 'b',],
    }
  }
}
</script>

<style scoped lang='less'>
  @debugBorder: 00.2cm groove orange;
  @cliWidth: 60%;
  @tableWidth: 33%;

  div#cli{
    float:left;
    table#internalRegs{
      position:relative;
      width: @tableWidth;
      td, th, tr{
        border: 0.1cm groove black;
        font-size: 20px;
      }
    }

    #history{
      position: relative;
      margin: 0 0 0 0;
      border: @debugBorder;
      width: @cliWidth;
                  // margin-left: 10%;
      text-align: left;
      float: left;
      div{
        position:relative;
                font-size: 20px;
        .command{

        }
        .commandTag{
          color: blue;
        }
      }
    }
  }


</style>
