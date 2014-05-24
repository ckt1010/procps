'use strict';

var Procjs = require('./build/Release/procjs').Procjs;

var procFlags = {
    PROC_FILLMEM     : 0x0001 // read statm
  , PROC_FILLCOM     : 0x0002 // alloc and fill in `cmdline'
  , PROC_FILLENV     : 0x0004 // alloc and fill in `environ'
  , PROC_FILLUSR     : 0x0008 // resolve user id number -> user name
  , PROC_FILLGRP     : 0x0010 // resolve group id number -> group name
  , PROC_FILLSTATUS  : 0x0020 // read status -- currently unconditional
  , PROC_FILLSTAT    : 0x0040 // read stat -- currently unconditional
  , PROC_FILLWCHAN   : 0x0080 // look up WCHAN name
  , PROC_FILLARG     : 0x0100 // alloc and fill in `cmdline'
  , PROC_LOOSE_TASKS : 0x0200 // threat threads as if they were processes
};

var defaultFlags = 0
  | procFlags.PROC_FILLMEM
  | procFlags.PROC_FILLCOM
  | procFlags.PROC_FILLENV
  | procFlags.PROC_FILLUSR
  | procFlags.PROC_FILLGRP
  | procFlags.PROC_FILLSTATUS
  | procFlags.PROC_FILLSTAT
  | procFlags.PROC_FILLWCHAN
  | procFlags.PROC_FILLARG
  | procFlags.PROC_LOOSE_TASKS
  ;

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}
exports.create = function getProcs(flags) {
  var pjs = new Procjs(flags || defaultFlags);

  var args;
  // passing result as args array instead of v8::Array return value
  // the callback is invoked synchronously
  pjs.procs(function () { args = Array.prototype.slice.call(arguments); });

  var ret =  { 
      procs: args
    , refresh: function (flags_) {
        var args_;
        pjs.refresh(flags_ || flags);
        pjs.procs(function () { args_ = Array.prototype.slice.call(arguments); });
        ret.procs = args_;
      }
  }
  return ret;
}

exports.procFlags    = procFlags;
exports.defaultFlags = defaultFlags;